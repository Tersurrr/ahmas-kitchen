import type { Metadata } from "next";
import CategoryNav from "@/components/CategoryNav";
import JsonLd from "@/components/JsonLd";
import MenuCard from "@/components/MenuCard";
import { getCategories, getMenuItems } from "@/lib/data";
import {
  createPageMetadata,
  menuStructuredData,
  webPageStructuredData,
} from "@/lib/seo";

// Revalidate periodically instead of fetching from Supabase on every request.
export const revalidate = 60;

const title = "African Food Menu: Pickup & Delivery";
const description =
  "Browse Amahs Kitchen's authentic African food menu, with freshly prepared meals available for pickup, delivery, and catering in Massachusetts.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/menu",
});

export default async function MenuPage() {
  const [categories, items] = await Promise.all([getCategories(), getMenuItems()]);
  const primaryMenuImage = items.find((item) => item.menu_images?.[0]?.url)
    ?.menu_images?.[0]?.url;

  return (
    <>
      <JsonLd
        data={webPageStructuredData({
          name: `${title} | Amahs Kitchen`,
          description,
          path: "/menu",
          pageType: "CollectionPage",
          primaryImageUrl: primaryMenuImage,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Menu", path: "/menu" },
          ],
        })}
      />
      <JsonLd data={menuStructuredData(categories, items)} />
      <div>
        <div className="max-w-container-max mx-auto px-4 md:px-gutter pt-10 pb-4">
          <span className="text-sm font-bold tracking-widest uppercase text-secondary">Menu</span>
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
    </>
  );
}
