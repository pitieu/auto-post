import { Composition } from "remotion";
import { ITJoke } from "./ITJoke";
import { Tweet } from "./Tweet";

export const YoutubeShorts = () => {
  return (
    <>
      {/* <Composition
        id="YoutubeShorts"
        component={ITJoke}
        durationInFrames={30 * 8 * 8}
        fps={30}
        width={1080}
        height={1080}
      /> */}
      <Composition
        id="YoutubeShortsTweet"
        component={Tweet}
        durationInFrames={30 * 8 * 8}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
