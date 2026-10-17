import type { Metadata } from "next";
import Hero from "@/components/Hero";
import BusinessOverview from "@/components/BusinessOverview";
import HomeMenu from "@/components/HomeMenu";
import HowItWorks from "@/components/HowItWorks";
import VideosPreview from "@/components/VideosPreview";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getCategories, getMenuItems, getVideos } from "@/lib/data";
import { createPageMetadata, webPageStructuredData } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Menu/category/video data changes rarely; revalidate once a minute instead of
// hitting Supabase on every request (this route reads cookies via the
// Supabase server client, which otherwise forces fully dynamic rendering).
export const revalidate = 60;

const title = "Amahs Kitchen | Authentic African Restaurant in Massachusetts";
const description = siteConfig.ownerName
  ? `${siteConfig.description} Founded and operated by ${siteConfig.ownerName}.`
  : siteConfig.description;

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [categories, items, allVideos] = await Promise.all([getCategories(), getMenuItems(), getVideos()]);
  const videos = allVideos.filter((v) => v.video_url);
  const itemsByCategory = new Map<string, typeof items>();
  for (const item of items) {
    if (!item.category_id) continue;
    const categoryItems = itemsByCategory.get(item.category_id) ?? [];
    categoryItems.push(item);
    itemsByCategory.set(item.category_id, categoryItems);
  }
  const compactItems = (categoryItems: typeof items) =>
    categoryItems.slice(0, 4).map((item) => ({
      ...item,
      menu_images: item.menu_images?.slice(0, 1),
      categories: undefined,
    }));
  const knownCategoryIds = new Set(categories.map((category) => category.id));
  const homeSections = categories
    .map((category) => ({
      category,
      items: compactItems(itemsByCategory.get(category.id) ?? []),
    }))
    .filter((section) => section.items.length > 0);
  const otherItems = compactItems(
    items.filter((item) => !item.category_id || !knownCategoryIds.has(item.category_id)),
  );
  if (otherItems.length > 0) {
    homeSections.push({
      category: { id: "other-menu-items", name: "More from the Menu", slug: "more", sort_order: Number.MAX_SAFE_INTEGER },
      items: otherItems,
    });
  }

  return (
    <>
      <JsonLd
        data={webPageStructuredData({
          name: title,
          description,
          path: "/",
          breadcrumbs: [{ name: "Home", path: "/" }],
        })}
      />
      <Hero />
      <BusinessOverview />
      <div className="cabinet-content">
        <HomeMenu sections={homeSections} />
        <HowItWorks />
        <VideosPreview videos={videos.slice(0, 3)} />
        <AboutSection />
        <Footer />
      </div>
    </>
  );
}
