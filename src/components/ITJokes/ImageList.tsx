import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
} from "remotion";

import { Memes } from "./Memes";

export const ImageList = ({ images }) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const opacity = interpolate(
    frame,
    [videoConfig.durationInFrames - 8, videoConfig.durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      className="flex h-full w-full flex-col justify-between"
      // style={{ opacity: opacity || 1 }}
    >
      <Memes images={images} imageDuration="8" />
      <Audio src={staticFile("assets/music/switched.mp3")} volume={0.1} />
    </div>
  );
};
