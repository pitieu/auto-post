import { bundle } from "@remotion/bundler";
import {
  getCompositions,
  renderFrames,
  stitchFramesToVideo,
} from "@remotion/renderer";
import fs from "fs";
import os from "os";
import path from "path";

const compositionId = "HelloWorld";

export const generateVideo = async (req, res) => {
  const sendFile = (file: string) => {
    fs.createReadStream(file)
      .pipe(res)
      .on("close", () => {
        res.end();
      });
  };
  try {
    const bundled = await bundle(path.join(__dirname, "./src/index.tsx"));
    const comps = await getCompositions(bundled, { inputProps: req.query });
    const video = comps.find((c) => c.id === compositionId);
    if (!video) {
      throw new Error(`No video called ${compositionId}`);
    }
    res.set("content-type", "video/mp4");

    const tmpDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "remotion-")
    );
    const { assetsInfo } = await renderFrames({
      config: video,
      webpackBundle: bundled,
      onStart: () => console.log("Rendering frames..."),
      onFrameUpdate: (f) => {
        if (f % 10 === 0) {
          console.log(`Rendered frame ${f}`);
        }
      },
      parallelism: null,
      outputDir: tmpDir,
      inputProps: req.query,
      compositionId,
      imageFormat: "jpeg",
    });

    const finalOutput = path.join(tmpDir, "out.mp4");
    await stitchFramesToVideo({
      dir: tmpDir,
      force: true,
      fps: video.fps,
      height: video.height,
      width: video.width,
      outputLocation: finalOutput,
      imageFormat: "jpeg",
      assetsInfo,
    });
    sendFile(finalOutput);
    console.log("Video rendered and sent!");
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
};
