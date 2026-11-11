import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default function BusinessOverview() {
  return (
    <section
      aria-labelledby="business-overview-title"
      className="mx-auto max-w-container-max px-4 pt-8 pb-6 md:px-gutter md:pt-10 md:pb-8"
    >
      <div className="grid overflow-hidden rounded-[1.75rem] bg-[#f0e4d2] shadow-soft md:min-h-[28rem] md:grid-cols-[0.94fr_1.06fr]">
        <div className="relative order-first min-h-[15rem] sm:min-h-[19rem] md:order-last md:min-h-[28rem]">
          <Image
            src="/images/business-overview-food.webp"
            alt="A bowl of African beef stew with greens and peppers, freshly prepared at Amahs Kitchen"
            fill
            quality={85}
            sizes="(max-width: 768px) calc(100vw - 2rem), 600px"
            className="object-cover object-[center_54%]"
          />
        </div>

        <div className="flex flex-col items-start justify-center px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-14 lg:px-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-dark">
            From our kitchen
          </span>
          <h2
            id="business-overview-title"
            className="mt-3 max-w-xl font-display text-3xl font-bold leading-[1.1] text-primary sm:text-4xl lg:text-[3.25rem]"
          >
            African food for the moments that bring us together.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
            We make authentic African dishes for everyday meals, family gatherings, and
            special occasions. Browse the menu, choose pickup or delivery, and send your
            order straight to our kitchen.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
            <MapPin size={17} className="shrink-0 text-secondary-dark" aria-hidden="true" />
            <span>Serving Dracut and the surrounding Massachusetts community</span>
          </div>
          <Link
            href="/menu"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dark"
          >
            Browse the menu
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
