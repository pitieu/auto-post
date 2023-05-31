import fetch from "node-fetch";

export async function getWikiImage(title: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&pithumbsize=500&format=json`;

  console.log(url);
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(`Unexpected response code: ${response.status}`);
  }

  const data = await response.json();

  console.log("result", data);

  // Extract page object
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  const page = pages[pageId];

  return page.thumbnail ? page.thumbnail.source : null;
}
