import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem, Video } from "@/lib/types";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Category[];
  } catch {
    return [];
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!supabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, menu_images(*), categories(*)")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as unknown as MenuItem[];
  } catch {
    return [];
  }
}

export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  const items = await getMenuItems();
  const featured = items.filter((i) => i.is_featured);
  return featured.length > 0 ? featured : items.slice(0, 8);
}

export async function getVideos(): Promise<Video[]> {
  if (!supabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Video[];
  } catch {
    return [];
  }
}
