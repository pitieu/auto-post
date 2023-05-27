import prettier from "prettier";
import fs from "fs";
import path from "path";

export const writeToFile = (file, data) => {
  fs.writeFileSync(
    path.resolve(__dirname, "../data/" + file + ".json"),
    prettier.format(JSON.stringify(data), { parser: "json" })
  );
};

export const getImage = (imageName) => {
  const file = fs.readFileSync(`public/assets/images/${imageName}.jpg`);
  const base64 = Buffer.from(file).toString("base64");
  const mimeType = "image/png";
  const dataURI = `data:${mimeType};base64,${base64}`;
  return dataURI
}
