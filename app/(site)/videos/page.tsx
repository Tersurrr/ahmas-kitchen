import type { Metadata } from "next";
import VideoCard from "@/components/VideoCard";
import { getVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kitchen Videos",
  description: "Go behind the scenes with Amahs kitchen food preparation, cooking demonstrations, and freshly prepared meals",
};

export default async function VideosPage() {
  const allVideos = await getVideos();
  const videos = allVideos.filter((v) => v.video_url);

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-gutter py-10">
      <span className="text-xs font-bold tracking-widest uppercase text-secondary">From the Kitchen</span>
      <h1 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3 mb-3">
        Kitchen Videos
      </h1>
      <p className="text-on-surface-variant max-w-xl mb-10">
        A behind the scenes look at food preparation, cooking demonstrations, and freshly prepared meals
      </p>

      {videos.length === 0 ? (
        <p className="text-on-surface-variant">No videos yet check back soon</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
