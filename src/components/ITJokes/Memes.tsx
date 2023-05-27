import { useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { Image } from "../Image";

export const Memes = ({ images, imageDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentImageIndex = Math.floor(frame / (imageDuration * fps));

  return (
    <div className="aspect-w-16 aspect-h-9 flex h-full w-full flex-row">
      {images &&
        images.map((image, index) => (
          <Image
            key={index}
            src={staticFile(image)}
            style={{ display: currentImageIndex === index ? "block" : "none" }}
            className="h-full w-full flex-shrink-0 object-contain object-center"
          />
        ))}
    </div>
  );
};
