import { exec } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
// @ts-ignore
import * as screenshotone from "screenshotone-api-sdk";
import sharp from "sharp";

const imageFolder = "public/images/screenshots/";

export const createThumbnailFromUrl = async (
  url: string
): Promise<{ url: string; thumbnail: string; image: string }> => {
  console.log("createThumbnailFromUrl", url);
  const client = new screenshotone.Client("o9jA46FYyqA0KA", "ZaquH2rk00QyHQ");

  const options = screenshotone.AnimateOptions.url(url)
    .scriptsWaitUntil("networkidle0")
    .format("gif")
    .scrollStartImmediately(true)
    .scenario("scroll");

  const imageBlob = await client.animate(options);
  const buffer = Buffer.from(await imageBlob.arrayBuffer());

  // create a unique id for the url
  const hash = crypto.createHash("sha256");
  hash.update(url);
  const urlId = hash.digest("hex");

  const pathImage = path.join(imageFolder, `${urlId}.gif`);
  fs.writeFileSync(pathImage, buffer);

  //   await resizeGif(`${urlId}`, 200);

  return Promise.resolve({
    url: `public/assets/screenshots/${url}.gif`,
    thumbnail: `public/assets/screenshots/${url}_tiny.gif`,
    image: buffer.toString("base64"),
  });
};

export const createThumbnail = async (
  filename: string,
  resizeWidth: number = 200
): Promise<void> => {
  console.log("createThumbnail");
  const inputBuffer = fs.readFileSync(
    path.join(imageFolder, filename + ".gif")
  );
  const outputPath = path.join(__dirname, imageFolder, filename + "_small.gif");

  const buffer = Buffer.from(inputBuffer);

  // Resize the image
  const resizedBuffer = await sharp(buffer)
    .resize(resizeWidth) // The width of the thumbnail
    .jpeg({ quality: 50 }) // Compress the image
    .toBuffer();

  fs.writeFileSync(outputPath, resizedBuffer);
  return Promise.resolve();
};

export const resizeGif = async (
  filename: string,
  resizeWidth: number = 200
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Read the GIF image
    const inputPath = path.join(__dirname, imageFolder, filename + ".gif");
    const outputPath = path.join(
      __dirname,
      imageFolder,
      filename + "_tiny.gif"
    );
    const command = `gifsicle --resize-width ${resizeWidth} --output ${outputPath} ${inputPath}`;

    // // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return reject(stderr);
      }
      console.log(`stdout: ${stdout}`);
      resolve();
    });
  });
};
