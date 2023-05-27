import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";

export const publishTweet = async (message: string, video) => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const mediaIdVideo = await client.v1.uploadMedia(video, { type: "longmp4" });

  await client.v2.tweetThread([
    {
      text: message,
      media: { media_ids: [mediaIdVideo] },
    },
    {
      text: "👉 Follow @" + process.env.TWITTER_ACCOUNT,
    },
  ]);
};
