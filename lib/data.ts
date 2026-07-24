import { createClient } from "@supabase/supabase-js";
import type { Category, MenuItem, Video } from "@/lib/types";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Public menu and video reads do not need a user session. Keeping this client
// cookie-free prevents a stale admin session from triggering an auth refresh
// and hiding otherwise public Supabase content.
const publicSupabase = supabaseConfigured
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    )
  : null;

export async function getCategories(): Promise<Category[]> {
  if (!publicSupabase) return [];
  try {
    const { data, error } = await publicSupabase
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
  if (!publicSupabase) return [];
  try {
    const { data, error } = await publicSupabase
      .from("menu_items")
      .select("*, menu_images(*), categories(*), menu_item_options(*)")
      .order("sort_order", { ascending: true })
      .order("sort_order", { ascending: true, referencedTable: "menu_item_options" });
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
  if (!publicSupabase) return [];
  try {
    const { data, error } = await publicSupabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Video[];
  } catch {
    return [];
  }
}
