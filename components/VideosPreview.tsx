import Link from "next/link";
import VideoCard from "./VideoCard";
import type { Video } from "@/lib/types";

export default function VideosPreview({ videos }: { videos: Video[] }) {
  const hasVideos = videos.length > 0;

  return (
    <section className={`${hasVideos ? "py-section-gap" : "py-12 md:py-16"} px-4 md:px-gutter max-w-container-max mx-auto bg-surface-container-low/50 rounded-3xl`}>
      <div className={`${hasVideos ? "mb-10" : ""} flex flex-col gap-4 px-4 pt-4 md:flex-row md:items-end md:justify-between`}>
        <div>
          <span className="text-sm font-bold tracking-widest uppercase text-secondary">From the Kitchen</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3">
            Kitchen Videos
          </h2>
        </div>
        <Link
          href="/videos"
          prefetch={true}
          className="w-fit rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
        >
          All kitchen videos
        </Link>
      </div>

      {hasVideos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </section>
  );
}
