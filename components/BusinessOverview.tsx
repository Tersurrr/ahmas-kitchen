import Image from "next/image";
import Link from "next/link";

export default function BusinessOverview() {
  return (
    <section
      aria-labelledby="business-overview-title"
      className="mx-auto max-w-container-max px-4 pt-8 pb-6 md:px-gutter md:pt-10 md:pb-8"
    >
      <div className="relative isolate flex min-h-[23rem] items-center overflow-hidden rounded-lg bg-primary shadow-soft md:min-h-[20rem]">
        <div className="absolute inset-0 -z-20 md:left-auto md:w-1/2">
          <Image
            src="/images/business-overview-food.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) calc(100vw - 2rem), 600px"
            className="object-cover object-[center_56%]"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-primary/65 md:bg-gradient-to-r md:from-primary md:via-primary/80 md:via-[50%] md:to-transparent" />

        <div className="relative z-10 max-w-3xl px-6 py-10 sm:px-10 md:px-14 md:py-10">
          <h2
            id="business-overview-title"
            className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-5xl"
          >
            African food from Amahs Kitchen
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Amahs Kitchen serves African meals for pickup, delivery, and special occasions
            in Massachusetts. Browse the menu and send your order directly to us on WhatsApp.
          </p>
          <Link
            href="/menu"
            className="mt-7 inline-flex items-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-on-secondary transition-colors hover:bg-secondary-dark"
          >
            Browse the menu
          </Link>
        </div>
      </div>
    </section>
  );
}
