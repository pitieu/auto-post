import fs from "fs";
// List of models
// https://huggingface.co/models?other=transformers.js&sort=modified

import { imageExists } from "./image";

// Transformer needs to use it's own server because it can only be used with type:module

export const classifyText = async (text) => {
  if (!text) throw new Error("Text is required");
  const out = await fetch(`http://localhost:3333/classify?text=${text}`);
  return out;
};

export const captionImage = async (imageName) => {
  if (!imageName) throw new Error("Image name is required");
  if (!imageExists(imageName))
    throw new Error("Image does not exist in public/assets/images");

  const out = await fetch(`http://localhost:3333/tag?imageName=${imageName}`);
  if (out.ok) {
    const data = await out.json();
    return data.output[0].generated_text;
  }
  return "";
};
