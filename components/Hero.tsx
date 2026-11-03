"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative scroll-mt-16">
      <div className="relative h-[68vh] h-[68dvh] min-h-[520px] w-full overflow-hidden sm:h-[85vh] sm:h-[85dvh] sm:min-h-[560px]">
        <Image
          src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=2000&auto=format&fit=crop"
          alt="A vibrant spread of freshly prepared African cuisine"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20 text-center">
          <div className="absolute inset-x-3 top-16 flex items-center justify-center gap-2 sm:inset-x-auto sm:gap-4 sm:top-16 md:top-20">
            <Image
              src="/images/amahs-kitchen-logo.webp"
              alt="Amahs Kitchen logo"
              width={128}
              height={128}
              className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32"
            />
            <p className="whitespace-nowrap font-brand text-5xl font-semibold leading-none tracking-tight text-[#C9A227] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] sm:text-8xl sm:tracking-wide md:text-9xl">
              Amahs Kitchen
            </p>
          </div>
          <div className="absolute inset-x-6 top-40 flex flex-col items-center sm:contents">
            <h1
              className="font-display text-4xl md:text-6xl font-bold text-white max-w-3xl leading-[1.18] drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:leading-tight sm:drop-shadow-none"
            >
              Authentic African Cuisine, Freshly Prepared
            </h1>
            <p
              className="mt-5 text-white/90 text-lg max-w-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:mt-6 sm:drop-shadow-none"
            >
              Fresh, flavorful African meals available for pickup and delivery
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-4 md:px-gutter -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-soft px-6 py-4 flex items-center justify-center gap-3 max-w-md mx-auto">
          <ShieldCheck className="text-secondary shrink-0" size={22} />
          <span className="text-sm font-semibold text-primary text-center">
            Registered Business in the State of Massachusetts
          </span>
        </div>
      </div>
    </section>
  );
}
