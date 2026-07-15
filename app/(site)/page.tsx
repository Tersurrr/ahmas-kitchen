import Hero from "@/components/Hero";
import HomeMenu from "@/components/HomeMenu";
import HowItWorks from "@/components/HowItWorks";
import VideosPreview from "@/components/VideosPreview";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { getCategories, getMenuItems, getVideos } from "@/lib/data";

// Menu/category/video data changes rarely; revalidate once a minute instead of
// hitting Supabase on every request (this route reads cookies via the
// Supabase server client, which otherwise forces fully dynamic rendering).
export const revalidate = 60;

export default async function HomePage() {
  const [categories, items, allVideos] = await Promise.all([getCategories(), getMenuItems(), getVideos()]);
  const videos = allVideos.filter((v) => v.video_url);

  return (
    <>
      <Hero />
      <HomeMenu categories={categories} items={items} />
      <HowItWorks />
      <VideosPreview videos={videos.slice(0, 3)} />
      <AboutSection />
      <Footer />
    </>
  );
}
