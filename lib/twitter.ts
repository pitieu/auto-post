import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import fetch from "node-fetch";

// export const publishTweet = async (message: string, video) => {
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

//   const mediaIdVideo = await client.v1.uploadMedia(video, { type: "longmp4" });

//   await client.v2.tweetThread([
//     {
//       text: message,
//       media: { media_ids: [mediaIdVideo] },
//     },
//     {
//       text: "👉 Follow @" + process.env.TWITTER_ACCOUNT,
//     },
//   ]);
// };

// Define types for the Tweet data
interface TweetData {
  id: string;
  text: string;
}

interface TweetResponse {
  data: TweetData;
}

interface TweetSearchResponse {
  data: TweetData[];
}

// Replace with your Bearer Token
const bearerToken: string = process.env.TWITTER_BEARER_TOKEN as string;

// Define headers
const headers: Record<string, string> = {
  Authorization: `Bearer ${bearerToken}`,
};

// Define a function to get a tweet
export async function getTweet(tweetId: string): Promise<TweetResponse> {
  // const client = new TwitterApi({
  //   appKey: process.env.TWITTER_API_KEY,
  //   appSecret: process.env.TWITTER_API_SECRET,
  //   accessToken: process.env.TWITTER_ACCESS_TOKEN,
  //   accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  // });

  // console.log(client);
  // @ts-ignore
  // return client.v1.oembedTweet(tweetId);
  // return client.v2.get("tweets", { ids: [tweetId] });

  console.log(`https://api.twitter.com/2/tweets/${tweetId}`, headers);
  const response = await fetch(
    `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}`,
    {
      headers,
    }
  );
  return (await response.json()) as TweetResponse;
}

// Define a function to search tweets
export async function searchTweets(
  query: string
): Promise<TweetSearchResponse> {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=${query}`,
    { headers }
  );
  return (await response.json()) as TweetSearchResponse;
}

export async function getThreads(tweetId: string) {
  const tweetResponse = await getTweet(tweetId);
  const conversationId: string = tweetResponse.data.id;
  const tweetSearchResponse = await searchTweets(
    `conversation_id:${conversationId}`
  );
  return tweetSearchResponse;
}

