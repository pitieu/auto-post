import express from "express";
import { pipeline, env } from "@xenova/transformers";

const app = express();
const port = 3000;

app.get("/classify", async (req, res) => {
  let pipe = await pipeline(
    "text-classification",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );
  let out = await pipe("I love transformers!");
  res.json(out);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
