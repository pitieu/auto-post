import ImageModel from "../models/Image.model";
import { getImage, writeToFile } from "./file";
import { delay } from "../utils";
import { downloadImages } from "./image";

type Image = {
  id: number;
  created: string;
  modified: string;
  image: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
};

export const getRandomLinks = async () => {
  const randomItems = await ImageModel.aggregate([{ $sample: { size: 8 } }]);
  console.log("Random items:", randomItems);
  writeToFile(
    "itJokes",
    randomItems.map((u) => u.image.replace("public/", "/"))
  );
  return randomItems;
};

export const fetchMemes = async () => {
  const options = {
    url: "https://programming-memes-images.p.rapidapi.com/v1/memes",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "programming-memes-images.p.rapidapi.com",
    },
  };

  const result = await fetch(options.url, {
    method: options.method,
    headers: options.headers,
  });

  if (result.ok) {
    const json: Image[] = await result.json();
    //   console.log(json);

    // fetch images and download them delayed by 300 ms
    // to prevent spamming the API
    const imageList = await Promise.all(
      json?.map(async (u: Image, index: number) => {
        const delayDuration = 300;
        const delayTime = index * delayDuration;
        // Delay execution before each download
        await delay(delayTime);
        const result = await downloadImages([u.image]);
        return {
          image: result[0].path,
          fid: u.id,
          url: u.image,
          name: result[0].name,
        };
      })
    );
    console.log(imageList);
    // await downloadImages(imageList, "public/assets/images/");
    ImageModel.insertMany(imageList, { ordered: false });
    return imageList;
  }
};
