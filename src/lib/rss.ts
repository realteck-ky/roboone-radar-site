import RSS from "rss-parser";
import YAML from 'yaml';
import path from 'path';
import fs from 'fs';

export type Feed = {
  slug: string;
  page_title: string;
  sites: Site[];
}

export type Site = {
  url: string;
  title: string;
  author: string;
  rss: string;
}

export async function getSiteConfig(){
  const filepath = path.join(process.cwd(),'sites.yaml');
  const config = fs.readFileSync(filepath, 'utf8');
  const docs: YAML.Document[] = YAML.parseAllDocuments(config);
  const feeds: Feed[] = docs.map(d => d.toJS());
  return feeds;
}

export async function getFeed(feedUrl: string) {
  const parser = new RSS();
  const feed = await parser.parseURL(feedUrl);

  return feed;
}