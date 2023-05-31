import { Sequence, useVideoConfig } from "remotion";
import { TwitterBackground } from "./components/Tweet/TwitterBackground";
// import data from "../data/tweets.json";
import { Tweet as TweetComponent } from "./components/Tweet/Tweet";

export const Tweet = () => {
  const videoConfig = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Sequence from={0} durationInFrames={videoConfig.durationInFrames}>
        <TwitterBackground />
      </Sequence>

      <Sequence from={0} durationInFrames={30 * 8 * 8} name="TweetList">
        <TweetComponent />
      </Sequence>
    </div>
  );
};
