import Link from "next/link";
import VideoCard from "./VideoCard";
import type { Video } from "@/lib/types";

export default function VideosPreview({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="py-section-gap px-4 md:px-gutter max-w-container-max mx-auto bg-surface-container-low/50 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 px-4 pt-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-secondary">From the Kitchen</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3">
            Kitchen Videos
          </h2>
        </div>
        <Link
          href="/videos"
          prefetch={true}
          className="text-sm font-semibold text-primary hover:text-secondary transition-colors underline underline-offset-4"
        >
          Watch All Videos →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}
