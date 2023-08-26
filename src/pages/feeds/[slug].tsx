import { Feed, getSiteConfig, getFeed, Site } from '../../lib/rss';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card, Typography } from '@material-tailwind/react';

type Data = {
  site: Site;
  item: any;
};

export async function getStaticPaths() {
  const feeds = await getSiteConfig();
  return {
    paths: feeds.map((feed) => ({ params: { slug: feed.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const feeds = await getSiteConfig();
  const feed = feeds.find((feed) => feed.slug === params.slug);
  const sites = feed?.sites;

  if (!sites) return;

  let data: Data[] = [];
  for (let site of sites) {
    if (site.rss) {
      try {
        const detailedFeed = await getFeed(site.rss);
        if (detailedFeed) {
          detailedFeed.items.forEach((item) => data.push({ site: site, item: item }));
        }
      } catch (e) {
        console.assert('[Error] RSS', site.rss);
      }
    } else if (site.url) {
      // TODO
      //   const response = await fetch(site.url);
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! Status: ${response.status}`);
      //   }
      //   // let result = '' + response.headers.get('last-modified');
      //   docs.push(response.headers);
    }
  }

  return {
    props: {
      feed,
      data: data,
    },
    revalidate: 1,
  };
}

function FeedGrid({ feed, data }: any) {
  return (
    <div>
      <h1 className="font-bold text-5xl mb-12 text-center">{feed.page_title}</h1>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid gap-4 p-5">
          {data.map((item: any, index: number) => (
            <a
              key={index}
              className="block p-4 border border-gray-200 hover:border-gray-500 rounded-lg"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* {console.log(item)} */}
              <div className="grid grid-flow-row sm:grid-flow-col gap-4 p-5">
                {item.enclosure?.url && (
                  <img
                    src={item.enclosure.url}
                    alt={item.title}
                    className="row-span-3 object-contain max-h-[20vh]"
                  />
                )}
                <h3 className="font-bold col-span-3">{item.title}</h3>
                <p className="col-span-3">{item.content}</p>
                <div className="col-span-3">{format(new Date(item.isoDate), 'PPP')}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeedTable({ feed, data }: any) {
  // Null contents check
  let data_feed = data.filter((d: Data) => d.item.title && d.item.isoDate && d.item.link);

  // Sort by date
  data_feed = data_feed.sort((a: Data, b: Data) =>
    new Date(a.item.isoDate) < new Date(b.item.isoDate) ? 1 : -1
  );

  // Filtered latest contents
  // data_feed = data_feed.filter(
  //   (x: Data, i: number, arr: Array<Data>) =>
  //     arr.findIndex((y: Data) => y.site.author === x.site.author) === i
  // );

  return (
    <div>
      <h1 className="font-bold text-5xl mb-12 text-center">{feed.page_title}</h1>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              {['Date', 'Blog', 'Author'].map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data_feed.map(({ site, item }: Data, index: number) => (
              <tr className="p-4 border-b border-blue-gray-50" key={index}>
                <td className="w-1/5">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {format(new Date(item.isoDate), 'yyyy MM/dd HH:mm')}
                  </Typography>
                </td>
                <td className="w-3/5">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    <Link
                      href={item.link}
                      className="font-medium text-blue-600 visited:text-purple-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      passHref
                    >
                      <div>{item.title}</div>
                    </Link>
                  </Typography>
                </td>
                <td className="w-1/5">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {site.author || site.title}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
