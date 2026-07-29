import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import VideoCard from "@/components/VideoCard";
import SocialFoodPosts from "@/components/SocialFoodPosts";
import { getVideos } from "@/lib/data";
import {
  createPageMetadata,
  videosStructuredData,
  webPageStructuredData,
} from "@/lib/seo";

const title = "African Cooking & Kitchen Videos";
const description =
  "Watch Amahs Kitchen prepare authentic African food through cooking demonstrations, behind-the-scenes kitchen videos, and freshly made meals.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/videos",
});

export default async function VideosPage() {
  const allVideos = await getVideos();
  const videos = allVideos.filter((v) => v.video_url);

  return (
    <>
      <JsonLd
        data={webPageStructuredData({
          name: `${title} | Amahs Kitchen`,
          description,
          path: "/videos",
          pageType: "CollectionPage",
          primaryImageUrl: videos.find((video) => video.thumbnail_url)?.thumbnail_url || undefined,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Kitchen Videos", path: "/videos" },
          ],
        })}
      />
      <JsonLd data={videosStructuredData(videos)} />
      <div className="max-w-container-max mx-auto px-4 md:px-gutter py-10">
        <span className="text-xs font-bold tracking-widest uppercase text-secondary">From the Kitchen</span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3 mb-3">
          Kitchen Videos
        </h1>
        <p className="text-on-surface-variant max-w-xl mb-10">
          A behind the scenes look at food preparation, cooking demonstrations, and freshly prepared meals
        </p>

        <SocialFoodPosts />

        {videos.length === 0 ? (
          <p className="text-on-surface-variant">No videos yet check back soon</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} headingLevel="h2" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
