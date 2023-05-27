import http, { IncomingMessage } from "http";
import https from "https";
import fs from "fs";

interface DownloadedFile {
  url: string;
  path: string;
  name: string;
}

export async function downloadImages(
  imageUrls: string[],
  destinationDirectory: string = "public/assets/images"
): Promise<DownloadedFile[]> {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory, { recursive: true });
  }

  const downloadedFiles: DownloadedFile[] = [];

  for (const imageUrl of imageUrls) {
    const imageName = getImageNameFromUrl(imageUrl);
    const destinationPath = `${destinationDirectory}/${imageName}`;

    await downloadImage(imageUrl, destinationPath);
    downloadedFiles.push({
      name: imageName,
      url: imageUrl,
      path: destinationPath,
    });
  }

  return downloadedFiles;
}

function getImageNameFromUrl(imageUrl: string): string {
  const urlParts = imageUrl.split("/");
  return urlParts[urlParts.length - 1].split("?")[0];
}

export function imageExists(imageName, extension = ".jpg") {
  const exists = fs.existsSync(
    "public/assets/images/" + imageName + (extension || ".jpg")
  );
  return exists;
}

export function downloadImage(
  imageUrl: string,
  destinationPath: string = "public/assets/images"
): Promise<{ imageUrl: string; destinationPath: string }> {
  const client = imageUrl.startsWith("https") ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destinationPath);

    client
      .get(imageUrl, (response: IncomingMessage) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            console.log(`Downloaded: ${destinationPath}`);
            resolve({ imageUrl, destinationPath });
          });
        });
      })
      .on("error", (err: Error) => {
        fs.unlink(destinationPath, () => {
          console.error(`Error downloading image: ${imageUrl}`, err.message);
          reject(err);
        });
      });
  });
}
