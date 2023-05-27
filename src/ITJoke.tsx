import { Sequence, useVideoConfig } from "remotion";

import { BaseBackground } from "./components/ITJokes/BaseBackground";

import useFetch from "./hooks/useFetch";
import { ImageList } from "./components/ITJokes/ImageList";

export const ITJoke = () => {
  const videoConfig = useVideoConfig();
  const { data } = useFetch();

  return (
    <div style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Background */}
      <Sequence from={0} durationInFrames={videoConfig.durationInFrames}>
        <BaseBackground />
      </Sequence>

      <Sequence from={0} durationInFrames={30 * 8 * 12} name="ProductList">
        <ImageList images={data} />
      </Sequence>
    </div>
  );
};
