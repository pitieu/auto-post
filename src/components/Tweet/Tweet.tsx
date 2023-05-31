import { useCallback, useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { getTweet } from "../../../lib/twitter";
import { Heart, Repeat2, MessageCircle, BarChart2, Share } from "lucide-react";

export const Tweet: React.FC<{ tweetId: string }> = ({ tweetId }) => {
  const [tweet, setTweet] = useState(null);
  const [handle] = useState(() => delayRender());

  const fetchData = useCallback(async () => {
    const tweetData = await fetch(
      "http://localhost:3001/tweet?tweetId=1663172827200225283"
    );
    console.log(tweetData);
    setTweet(tweetData.data);
    continueRender(handle);
  }, [tweetId, handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!tweet) {
    return null; // Return null while tweet data is being fetched
  }

  return (
    <div
      style={{ flex: 1 }}
      className="flex w-[600px] flex-row items-center justify-center border-b border-gray-300 p-5 font-sans "
    >
      <div>
        <img
          className="mr-2 rounded-full"
          src={tweet.avatarUrl}
          width="48"
          height="48"
        />
      </div>
      <div className="flex flex-col justify-center ">
        <div className="mb-2 flex gap-2">
          <span className="font-bold">{tweet.username}</span>
          <span className="text-gray-500">@{tweet.handle}</span>
          <span className="text-gray-500">{tweet.timestamp}</span>
        </div>
        <div className="mb-2 text-base leading-normal text-black">
          {tweet.content}
        </div>
        <div className="flex gap-4">
          <div className="flex items-center text-gray-500">
            <MessageCircle className="mr-2" />
            <span>{tweet.comments}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Repeat2 className="mr-2" />
            <span>{tweet.retweets}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Heart className="mr-2" />
            <span>{tweet.likes}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <BarChart2 className="mr-2" />
            <span>{tweet.views}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Share className="mr-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
