import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { initMongoose } from "./lib/mongodb";
import { getImage } from "./lib/file";
import { downloadImage, imageExists } from "./lib/image";
import { captionImage, upscaleImage } from "./lib/replicate";
import { captionImage as transformerCaption } from "./lib/transformers";
import { createThumbnailFromUrl } from "./lib/screenshot";
import { ytCallback, ytLogin } from "./lib/youtube";
import { fetchMemes, getRandomLinks } from "./lib/itmeme";
import { fetchStreetView } from "./lib/google";
import { generateVideo } from "./lib/remotion";
import { getWikiImage } from "./lib/wikimedia";
import { getTop10 } from "./lib/openai";
import { getTweet } from "./lib/twitter";
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/", function (req, res) {
  res.send("This is a basic Example for Express.js");
});

app.get("/tweet", async (req, res) => {
  try {
    const { tweetId } = req.query;
    if (!tweetId) throw new Error("No tweetId param");

    const tweet = await getTweet(tweetId as string);
    // const tweet = "hello";
    res.json(tweet);
  } catch (e) {
    console.log(e);
    res.json();
  }
});

app.get("/openai", async (req, res) => {
  let { text } = req.query;
  if (!text) text = "beaches in bali"; //throw new Error("Text required");

  const result = await getTop10(text as string);
  res.json(result);
});

app.get("/wikimedia", async (req, res) => {
  const search = req.query.search as string;
  if (!search) throw new Error("Search query required");

  const imageUrl = await getWikiImage(search as string);

  if (imageUrl) {
    console.log(`Image URL: ${imageUrl}`);
    await downloadImage(
      imageUrl,
      `public/assets/images/${search.replace(/ /g, "_")}.png`
    );
    res.json(imageUrl);
  } else {
    console.log("No image found.");
    res.json("No image found");
  }
});

app.get("/thumbnail/create", async (req, res) => {
  if (!req.query.url) throw new Error("No image param");

  const result = createThumbnailFromUrl(req.query.url as string);
  res.json(result);
});

// remove bottom X pixels
// app.get("/resize/image", async (req, res) => {
//   if (!req.query.imageName) throw new Error("No image param");
//   if (!imageExists(req.query.imageName))
//     throw new Error("Image does not exist in public/assets/images");
//   const { width, height } = await sharp("./streetview.jpg") //req.query.imageName
//     .metadata();

//   await sharp("./streetview.jpg") //req.query.imageName
//     .extract({ left: 0, top: 0, width, height: height - 10 })
//     .toFile("output.jpg");
// });

/**
 * Generates a streetview image
 */
app.get("/streetview", async (req, res) => {
  if (!req.query.longitude) throw new Error("longitude required");
  if (!req.query.latitude) throw new Error("latitude required");

  const url = await fetchStreetView({
    longitude: req.query.longitude as string,
    latitude: req.query.latitude as string,
  });
  const output = await transformerCaption("streetview");
  res.json({
    ...req.query,
    url,
    descriptionImage: output,
    hasBeach: output.indexOf("beach") > -1,
  });
});

/**
 * Input image get simple description
 * FREE it is process on server
 */
app.get("/image/caption_free", async (req: any, res: any) => {
  try {
    if (!req.query.imageName) throw new Error("No image param");
    if (!imageExists(req.query.imageName))
      throw new Error("Image does not exist in public/assets/images");
    const output = await transformerCaption(req.query.imageName);

    res.json(output);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

/**
 * Input image get a detailed description
 * Every call here costs money
 */
app.get("/replicate/caption", async (req: any, res: any) => {
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

app.get("/replicate/upscale", async (req: any, res: any) => {
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

app.get("/itmeme/image", async (req, res) => {
  try {
    const randomItems = await getRandomLinks();
    res.json(randomItems);
  } catch (e) {
    res.json();
    console.log(e);
  }
});

app.get("/fetch/itmeme", async (req, res) => {
  try {
    const imageList = await fetchMemes();
    res.send(imageList);
  } catch (e) {
    console.log(e);
  }
});

app.get("/generate", async (req, res) => {
  try {
    await fetchMemes();

    console.log("generate");
    await generateVideo(req, res);
  } catch (e) {
    console.log(e);
  }
});

app.get("/login", ytLogin);
app.get("/oauth2callback", ytCallback);

initMongoose().then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
