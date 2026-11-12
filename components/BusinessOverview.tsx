import Image from "next/image";
import Link from "next/link";

export default function BusinessOverview() {
  return (
    <section
      aria-labelledby="business-overview-title"
      className="mx-auto max-w-container-max px-4 pt-8 pb-6 md:px-gutter md:pt-10 md:pb-8"
    >
      <div className="relative isolate flex min-h-[23rem] items-center overflow-hidden rounded-2xl bg-primary shadow-soft md:min-h-[20rem]">
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
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-secondary-container">
            Business overview
          </span>
          <h2
            id="business-overview-title"
            className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-5xl"
          >
            Amahs Kitchen at a glance
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Amahs Kitchen is a registered Massachusetts food business serving authentic
            African cuisine for everyday meals and special occasions. Customers can browse
            the menu online, choose pickup or delivery, and send their order directly to
            the kitchen through WhatsApp.
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
