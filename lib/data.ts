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
      .select("*, menu_images(*), categories(*), menu_item_options(*)")
      .order("sort_order", { ascending: true })
      .order("sort_order", { ascending: true, referencedTable: "menu_item_options" });
    if (!error && data) return data as unknown as MenuItem[];

    // Fall back to a query without menu_item_options if that table/migration isn't
    // available yet, so the rest of the menu still works with single fixed prices.
    const fallback = await supabase
      .from("menu_items")
      .select("*, menu_images(*), categories(*)")
      .order("sort_order", { ascending: true });
    if (fallback.error || !fallback.data) return [];
    return fallback.data as unknown as MenuItem[];
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
