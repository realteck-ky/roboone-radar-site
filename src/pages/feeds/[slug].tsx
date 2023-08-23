import { FEEDS, getFeed } from '../../lib/rss';
import { format } from 'date-fns';
import Link from 'next/link';

export async function getStaticPaths() {
  return {
    paths: FEEDS.map((feed) => ({ params: { slug: feed.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const feed = FEEDS.find((feed) => feed.slug === params.slug);

  if (!feed) return;

  console.log(feed.sites[0].url);
  const detailedFeed = await getFeed(feed.sites[0].url);

  return {
    props: {
      feed,
      items: detailedFeed.items,
    },
    revalidate: 1,
  };
}

function FeedGrid({ feed, items }: any) {
  return (
    <div>
      <h1 className="font-bold text-5xl mb-12 text-center">{feed.title}</h1>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid gap-4 p-5">
          {items.map((item: any, index: number) => (
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

export default function FeedTable({ feed, items }: any) {
  return (
    <div>
      <h1 className="font-bold text-5xl mb-12 text-center">{feed.title}</h1>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <table className="table-auto border-separate border-spacing-x-4 border-none">
          <thead>
            <tr>
              <th>Date</th>
              <th>Blog</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr className="gap-4 p-4">
                {console.log(item)}
                <td>{format(new Date(item.isoDate), 'yyyy MM/dd HH:mm')}</td>
                <td>
                  <Link
                    href={item.link}
                    className="font-medium text-blue-600 visited:text-purple-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    {item.title}
                  </Link>
                </td>
                <td>{item.creator || item.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
