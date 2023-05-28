import express from "express";
import { pipeline } from "@xenova/transformers";
import path from "path";
// List of available models
// https://huggingface.co/models?other=transformers.js&sort=modified

const app = express();
const port = 3333;
const __dirname = path.resolve();

app.get("/classify", async (req, res) => {
  try {
    const t0 = performance.now();

    let pipe = await pipeline(
      "text-classification",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
    );
    let out = await pipe("I love transformers!");
    const t1 = performance.now();
    res.json({ output: out, execution_time: Math.ceil(t1 - t0) + "ms" });
  } catch (e) {
    console.log(e);
  }
});

app.get("/tag", async (req, res) => {
  try {
    if (!req.query.imageName) throw Error("imageName is required");
    const t0 = performance.now();
    let pipe = await pipeline(
      "image-to-text",
      "Xenova/vit-gpt2-image-captioning"
    );
    const pathFile = path.resolve(
      __dirname,
      `./public/assets/images/${req.query.imageName}.jpg`
    );
    const t1 = performance.now();

    let out = await pipe(pathFile);
    res.json({ output: out, execution_time: Math.ceil(t1 - t0) + "ms" });
  } catch (e) {
    console.log(e);
    res.json({});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Transformers server http://localhost:${port}/`);
});
