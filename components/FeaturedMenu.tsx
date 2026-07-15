import Link from "next/link";
import MenuCard from "./MenuCard";
import type { MenuItem } from "@/lib/types";

export default function FeaturedMenu({ items }: { items: MenuItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-section-gap px-4 md:px-gutter max-w-container-max mx-auto">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div>
          <span className="font-display text-3xl md:text-4xl font-bold text-primary">Featured</span>
        </div>
        <Link
          href="/menu"
          className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dark"
        >
          Menu
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
