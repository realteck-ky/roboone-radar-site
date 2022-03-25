import Parser from "rss-parser";

type Feed = {
  slug: string;
  title: string;
  url: string;
}

export const FEEDS: Feed[] = [
  {
    slug: "vg",
    title: "VG",
    url: "https://www.vg.no/rss/feed",
  },
  {
    slug: "nrk",
    title: "NRK Topp Saker",
    url: "https://www.nrk.no/toppsaker.rss",
  }
];

export async function getFeed(feedUrl: string) {
  const parser = new Parser();

  const feed = await parser.parseURL(feedUrl);

  return feed;
}