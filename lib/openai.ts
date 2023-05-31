import {
  Configuration,
  OpenAIApi,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateCompletionRequestPrompt,
} from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY as string,
});
export const openai = new OpenAIApi(configuration);

export const chatCompletion = async (
  messages: CreateChatCompletionRequest["messages"]
) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    if (!response) return "";
    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      const text = response.data.choices[0].message.content.trim();

      return text;
    } else {
      return "";
    }
  } catch (e: any) {
    console.log(e);
  }
};

export const openaiCompletion = async (
  prompt: CreateCompletionRequestPrompt,
  options: CreateCompletionRequest = {
    model: "text-davinci-003",
    max_tokens: 500,
  }
) => {
  console.log("\x1b[36mopenaiCompletion options\x1b[30m", options);
  console.log(`\x1b[94mPROMPT: ${prompt}\x1b[30m`);

  const response = await openai.createCompletion({
    prompt: prompt,
    ...options,
  });
  console.log(
    "\x1b[32mResult: \x1b[30m",
    response.data.choices[0].text?.trim()
  );
  return response.data.choices[0].text?.trim();
};

export const summarizeWebsite = async (
  content: string,
  options?: CreateCompletionRequest | undefined
): Promise<string | undefined> => {
  const prompt = `Please summarize the following website content, do not describe the general website, but instead concisely extract the specific information this sub page contains.: \n
            Website:\n${content}`;

  return await openaiCompletion(prompt, options);
};

export const summarizeProduct = async (
  content: string,
  product: string,
  options?: CreateCompletionRequest | undefined
): Promise<string | undefined> => {
  const prompt = `Summarize the following content into a small paragraph, do not describe the general content, but instead concisely extract only information about this product "${product}" in this page and describe it as if it was a product description. Translate to english if necessary and summarize it.\nContent:\n\n${content}\n`;
  return await openaiCompletion(prompt, options);
};

export const summarizeAndTranslate = async (
  content: string,
  options?: CreateCompletionRequest | undefined
): Promise<string | undefined> => {
  const prompt = `Translate the text below to english and describe it as if it was a product description:\n\n${content}\n`;
  return await openaiCompletion(prompt, options);
};

export const getTop10 = async (
  text: string,
  options?: CreateCompletionRequest | undefined
): Promise<string | undefined> => {
  if (!text) return "";
  const prompt = `list top 10 ${text} and output in json format:

Output example:
[
"beach name 1",
"beach name number 2",
...
]

Output: 
[`;

  let result = await openaiCompletion(prompt, options);
  result = "[" + result;
  try {
    result = JSON.parse(result);
    return result;
  } catch (e) {
    console.log(e);
    return "";
  }
};
