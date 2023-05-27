import { Composition } from "remotion";
import { ITJoke } from "./ITJoke";

export const YoutubeShorts = () => {
  return (
    <>
      <Composition
        id="YoutubeShorts"
        component={ITJoke}
        durationInFrames={30 * 8 * 12}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
