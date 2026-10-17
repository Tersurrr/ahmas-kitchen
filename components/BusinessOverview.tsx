import Link from "next/link";

export default function BusinessOverview() {
  return (
    <section
      aria-labelledby="business-overview-title"
      className="mx-auto max-w-container-max px-4 py-12 md:px-gutter md:py-16"
    >
      <div className="rounded-2xl bg-white p-6 shadow-soft md:p-10">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-widest text-secondary">
            Business overview
          </span>
          <h2
            id="business-overview-title"
            className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl"
          >
            Amahs Kitchen at a glance
          </h2>
          <p className="mt-4 leading-relaxed text-on-surface-variant">
            Amahs Kitchen is a registered Massachusetts food business serving authentic
            African cuisine for everyday meals and special occasions. Customers can browse
            the menu online, choose pickup or delivery, and send their order directly to
            the kitchen through WhatsApp.
          </p>
        </div>

        <div className="mt-7">
          <Link
            href="/menu"
            className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dark"
          >
            Browse the menu
          </Link>
        </div>
      </div>
    </section>
  );
}
