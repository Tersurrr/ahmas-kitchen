import { Clock3, MapPin, MessageCircle, PartyPopper, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const overviewItems = [
  {
    icon: UtensilsCrossed,
    term: "What we serve",
    detail: "Freshly prepared, authentic African meals made with quality ingredients.",
  },
  {
    icon: MapPin,
    term: "Service area",
    detail: "Pickup, delivery, and food service across Massachusetts.",
  },
  {
    icon: PartyPopper,
    term: "Catering",
    detail: "African food for birthdays, weddings, celebrations, and special events.",
  },
  {
    icon: Clock3,
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
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
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
                <item.icon size={20} className="shrink-0 text-secondary" aria-hidden="true" />
                {item.term}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dark"
          >
            Browse the menu
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
          >
            <MessageCircle size={17} aria-hidden="true" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
