import fetch from "node-fetch";
import stream from "stream";
import dotenv from "dotenv";
import { promisify } from "util";
import fs from "fs";

dotenv.config();

const pipeline = promisify(stream.pipeline);

export const fetchStreetView = async ({
  width = "600",
  height = "300",
  longitude,
  latitude,
}: {
  width?: string;
  height?: string;
  longitude: string;
  latitude: string;
}) => {
  if (!longitude) throw new Error("longitude required");
  if (!latitude) throw new Error("latitude required");

  const url = `https://maps.googleapis.com/maps/api/streetview?size=${height}x${width}&location=${latitude},${longitude}&fov=80&heading=70&pitch=0&key=${process.env.GOOGLE_STREET_API}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`HTTP request failed with status ${response.status}`);
  }

  await pipeline(response.body, fs.createWriteStream("streetview.jpg"));

  return url;
};
