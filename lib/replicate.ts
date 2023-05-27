import Replicate from "replicate";

export const upscaleImage = async (image: string): Promise<string> => {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  //https://replicate.com/mv-lab/swin2sr
  // takes around 5-7 seconds $0.00055 / second
  const output = await replicate.run(
    "mv-lab/swin2sr:a01b0512004918ca55d02e554914a9eca63909fa83a29ff0f115c78a7045574f",
    {
      input: {
        image: image,
        task: "real_sr", // or "classical_sr" or "compressed_sr" depending on your needs
      },
    }
  );

  // @ts-ignore
  return output;
};

export const captionImage = async (image: string) => {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  //https://replicate.com/daanelson/minigpt-4/api
  // takes around 6-12 seconds $0.0023 / second
  const output = await replicate.run(
    "daanelson/minigpt-4:b96a2f33cc8e4b0aa23eacfce731b9c41a7d9466d9ed4e167375587b54db9423",
    {
      input: {
        image: image,
        prompt:
          "Describe the image in detail. Do not describe what's not in it.",
      },
    }
  );
  return output;
};
