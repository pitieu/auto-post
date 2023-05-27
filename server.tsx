import Youtube from "youtube-api";
import fs from "fs";
import readJson from "r-json";
import Logger from "bug-killer";
import opn from "opn";
import express from "express";
import dotenv from "dotenv";
import stream from "stream";
import { promisify } from "util";
import sharp from "sharp";

import { initMongoose } from "./lib/mongodb";
import { getImage, writeToFile } from "./lib/file";
import ImageModel from "./models/Image.model";
import { downloadImages, downloadImage, imageExists } from "./lib/image";
import { captionImage, upscaleImage } from "./lib/replicate";
import { createThumbnailFromUrl } from "./lib/screenshot";
dotenv.config();
const pipeline = promisify(stream.pipeline);

const app = express();
const PORT = 3000;

// I downloaded the file from OAuth2 -> Download JSON
const CREDENTIALS = readJson(`./credentials.json`);

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
  type: "oauth",
  client_id: CREDENTIALS.web.client_id,
  client_secret: CREDENTIALS.web.client_secret,
  redirect_url: CREDENTIALS.web.redirect_uris[0],
});

type Image = {
  id: number;
  created: string;
  modified: string;
  image: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
};

app.get("/", function (req, res) {
  res.send("This is a basic Example for Express.js");
});

app.get("/thumbnail/create", async (req, res) => {
  if (!req.query.url) throw new Error("No image param");

  const result = createThumbnailFromUrl(req.query.url as string);
  res.json(result);
});

app.get("/streetview", async (req, res) => {
  sharp("input.jpg")
    .metadata()
    .then(({ width, height }) =>
      sharp("input.jpg")
        .extract({ left: 0, top: 0, width, height: height - 10 })
        .toFile("output.jpg")
    )
    .then(() => console.log("Image cropped successfully"))
    .catch((err) => console.error(err));
});

app.get("/streetview", async (req, res) => {
  //   if (!req.query.longitude) throw new Error("longitude required");
  //   if (!req.query.latitiude) throw new Error("latitiude required");

  // @ts-ignore
  req.query.longitude = 115.2537;
  // @ts-ignore
  req.query.latitude = -8.5065;
  const key = process.env.GOOGLE_STREET_API;
  const url = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${req.query.latitude},${req.query.longitude}&fov=80&heading=70&pitch=0&key=${key}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    },
  });
  // @ts-ignore
  await pipeline(response.body, fs.createWriteStream("streetview.jpg"));

  res.json({ ...req.query, url });
});

app.get("/image/caption", async (req: any, res: any) => {
  try {
    if (!req.query.imageName) throw new Error("No image param");
    if (!imageExists(req.query.imageName))
      throw new Error("Image does not exist in public/assets/images");
    const dataURI = getImage(req.query.imageName);
    const output = await captionImage(dataURI);

    res.json(output);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

app.get("/image/upscale", async (req: any, res: any) => {
  try {
    if (!req.query.imageName) throw new Error("No image param");
    if (!imageExists(req.query.imageName))
      throw new Error("Image does not exist in public/assets/images");
    const dataURI = getImage(req.query.imageName);
    const output = await upscaleImage(dataURI);

    await downloadImage(
      output.replace(/"/g, ""),
      `public/assets/images/${req.query.imageName}_up.png`
    );
    res.json(output);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

app.get("/image/file/generate", async (req, res) => {
  const randomItems = await ImageModel.aggregate([{ $sample: { size: 10 } }]);
  console.log("Random items:", randomItems);
  writeToFile(
    "itJokes",
    randomItems.map((u) => u.image.replace("public/", "/"))
  );
  res.json(randomItems);
});

app.get("/fetch/itmeme", async (req, res) => {
  try {
    const options = {
      url: "https://programming-memes-images.p.rapidapi.com/v1/memes",
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "fa17b9b471msha4a2c5a95ba7ca3p1df2e8jsn77e55d34726e",
        "X-RapidAPI-Host": "programming-memes-images.p.rapidapi.com",
      },
    };
    const result = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });

    if (result.ok) {
      const json: Image[] = await result.json();
      //   console.log(json);
      const imageList = await Promise.all(
        json?.map(async (u: Image, index: number) => {
          const delayDuration = 300;
          const delayTime = index * delayDuration;
          // Delay execution before each download
          await delay(delayTime);
          const result = await downloadImages([u.image]);
          return {
            image: result[0].path,
            fid: u.id,
            url: u.image,
            name: result[0].name,
          };
        })
      );
      console.log(imageList);
      // await downloadImages(imageList, "public/assets/images/");
      ImageModel.insertMany(imageList, { ordered: false });

      res.send(imageList);
    } else {
      res.send(400).json();
      // throw new Error("Response not ok");
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/login", function (req, res) {
  opn(
    oauth.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/youtube.upload"],
    })
  );
});

app.get("/oauth2callback", (req, res) => {
  console.log("callback");
  oauth.getToken(req.query.code, async (err, tokens) => {
    if (err) {
      return Logger.log(err);
    }

    console.log("Got the tokens.", tokens);

    oauth.setCredentials(tokens);
    var req = await Youtube.videos.insert(
      {
        // notifySubscribers: true, // notify users about this video. Should be done with moderation
        resource: {
          // Video title and description
          snippet: {
            title: "Testing YoutTube API NodeJS module",
            description: "Test video upload via YouTube API",
            tags: [],
            // defaultLanguage: 'en',
          },
          // I don't want to spam my subscribers
          status: {
            privacyStatus: "private",
          },
        },
        // This is for the callback function
        part: "snippet,status",

        // Create the readable stream to upload the video
        media: {
          body: fs.createReadStream("out/video.mp4"),
        },
      },
      (err, data) => {
        console.log("Done.");
      }
    );
    res.send("done");
  });
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initMongoose().then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
