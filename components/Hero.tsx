"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative scroll-mt-16">
      <div className="relative h-[85vh] h-[85dvh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=2000&auto=format&fit=crop"
          alt="A vibrant spread of freshly prepared African cuisine"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-20">
          <div className="absolute inset-x-3 top-16 flex items-center justify-center gap-3 sm:inset-x-auto sm:gap-4 sm:top-16 md:top-20">
            <Image
              src="/images/amahs-kitchen-logo.webp"
              alt="Amahs Kitchen logo"
              width={56}
              height={56}
              className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
            />
            <p className="whitespace-nowrap font-brand text-5xl font-semibold leading-none tracking-wide text-[#C9A227] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] sm:text-8xl md:text-9xl">
              Amahs Kitchen
            </p>
          </div>
          <h1
            className="font-display text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight"
          >
            Authentic African Cuisine, Freshly Prepared
          </h1>
          <p
            className="mt-6 text-white/90 text-lg max-w-xl"
          >
            Fresh, flavorful African meals available for pickup and delivery
          </p>
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
