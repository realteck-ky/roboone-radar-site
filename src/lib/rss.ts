import RSS from "rss-parser";

type Feed = {
  slug: string;
  page_title: string;
  sites: Site[];
}

type Site = {
  url: string;
  title: string;
  author: string;
  rss: string;
}

export const FEEDS: Feed[] = [
  {
    slug: "roboone",
    page_title: "ROBO-ONE",
    sites: [{
      title: "",
      author: "",
      rss: "http://ant.mtlab.jp/robo-one/rss/all.rdf",
      url: "http://ant.mtlab.jp/robo-one/rss/all.rdf"
    }]
  }
];

export async function getFeed(feedUrl: string) {
  const parser = new RSS();
  const feed = await parser.parseURL(feedUrl);

  return feed;
}