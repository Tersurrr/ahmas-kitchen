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
      <HomeMenu categories={categories} items={items} />
      <HowItWorks />
      <VideosPreview videos={videos.slice(0, 3)} />
      <AboutSection />
      <Footer />
    </>
  );
}
