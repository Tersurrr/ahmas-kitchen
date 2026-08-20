import Link from "next/link";

const overviewItems = [
  {
    term: "What we serve",
    detail: "Freshly prepared, authentic African meals made with quality ingredients.",
  },
  {
    term: "Service area",
    detail: "Pickup, delivery, and food service across Massachusetts.",
  },
  {
    term: "Catering",
    detail: "African food for birthdays, weddings, celebrations, and special events.",
  },
  {
    term: "Business hours",
    detail: "Open Tuesday through Sunday. Pickup 11am–7pm; delivery 12pm–6pm.",
  },
] as const;

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

        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {overviewItems.map((item) => (
            <div
              key={item.term}
              className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5"
            >
              <dt className="flex items-center gap-3 font-display text-lg font-semibold text-primary">
                <span className="h-5 w-1 rounded-full bg-secondary/70" aria-hidden="true" />
                {item.term}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>

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
