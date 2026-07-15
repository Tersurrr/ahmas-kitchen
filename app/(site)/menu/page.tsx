import type { Metadata } from "next";
import CategoryNav from "@/components/CategoryNav";
import MenuCard from "@/components/MenuCard";
import { getCategories, getMenuItems } from "@/lib/data";

// Revalidate periodically instead of fetching from Supabase on every request.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Full Menu",
  description: "Browse the complete Amahs kitchen menu, including rice, snails, soups, sides, drinks, and specials.",
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([getCategories(), getMenuItems()]);

  return (
    <div>
      <div className="max-w-container-max mx-auto px-4 md:px-gutter pt-10 pb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-secondary">Menu</span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3">
          Our Full Menu
        </h1>
        <p className="text-on-surface-variant mt-3 max-w-xl">
          Every dish is prepared fresh to order. Tap a category to jump straight there
        </p>
      </div>

      {categories.length > 0 && <CategoryNav categories={categories} />}

      <div className="max-w-container-max mx-auto px-4 md:px-gutter py-10 space-y-16">
        {items.length === 0 ? (
          <p className="text-on-surface-variant text-center py-16">
            Our menu is being freshly prepared. Check back soon.
          </p>
        ) : (
          categories.map((category) => {
            const categoryItems = items.filter((item) => item.category_id === category.id);
            if (categoryItems.length === 0) return null;

            return (
              <section key={category.id} id={`category-${category.slug}`} className="scroll-mt-32">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-6">
                  {category.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {categoryItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
