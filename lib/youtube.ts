import readJson from "r-json";
import Logger from "bug-killer";
import Youtube from "youtube-api";
import opn from "opn";
import fs from "fs";

const CREDENTIALS = readJson(`./credentials.json`);

let oauth = Youtube.authenticate({
  type: "oauth",
  client_id: CREDENTIALS.web.client_id,
  client_secret: CREDENTIALS.web.client_secret,
  redirect_url: CREDENTIALS.web.redirect_uris[0],
});

export const ytLogin = function (req, res) {
  opn(
    oauth.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/youtube.upload"],
    })
  );
};

export const ytCallback = (req, res) => {
  console.log("callback");
  oauth.getToken(req.query.code, async (err, tokens) => {
    if (err) {
      return Logger.log(err);
    }

    console.log("Got the tokens.", tokens);

    oauth.setCredentials(tokens);
    await Youtube.videos.insert(
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
};
