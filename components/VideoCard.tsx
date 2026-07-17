"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/types";

export default function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="relative aspect-video bg-surface-container-high">
        {playing ? (
          <video
            src={video.video_url}
            poster={video.thumbnail_url || undefined}
            controls
            autoPlay
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="group w-full h-full relative"
          >
            {video.thumbnail_url && (
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play className="text-primary ml-1" size={26} fill="currentColor" />
              </span>
            </div>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-primary">{video.title}</h3>
        {video.description && (
          <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{video.description}</p>
        )}
      </div>
    </div>
  );
}
