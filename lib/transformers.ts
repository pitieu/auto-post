import { pipeline } from "@xenova/transformers";
// List of models
// https://huggingface.co/models?other=transformers.js&sort=modified

export const classifyText = async (text) => {
  if (!text) return "";

  let pipe = await pipeline(
    "text-classification",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );
  let out = await pipe(text);
  return out;
};
