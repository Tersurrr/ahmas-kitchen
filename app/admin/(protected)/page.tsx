"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ClipboardList,
  Clapperboard,
  PackagePlus,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/whatsapp";
import type { OrderRecord } from "@/lib/types";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ items: 0, categories: 0, videos: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      const [itemsRes, categoriesRes, videosRes, ordersRes, recentRes] = await Promise.all([
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
      ]);

      setStats({
        items: itemsRes.count || 0,
        categories: categoriesRes.count || 0,
        videos: videosRes.count || 0,
        orders: ordersRes.count || 0,
      });
      setRecentOrders((recentRes.data as OrderRecord[]) || []);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const cards = [
    { label: "Menu items", value: stats.items, icon: UtensilsCrossed, href: "/admin/menu" },
    { label: "Categories", value: stats.categories, icon: Tag, href: "/admin/categories" },
    { label: "Videos", value: stats.videos, icon: Clapperboard, href: "/admin/videos" },
    { label: "Orders", value: stats.orders, icon: ClipboardList, href: "/admin/orders" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-7">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary mt-1">Admin</h1>
          <p className="text-sm text-on-surface-variant mt-1">Protecting user data is your top priority</p>
        </div>
        <Link href="/admin/menu" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-dark transition-colors">
          <PackagePlus size={16} /> Add menu item
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 border border-outline-variant/30 rounded-2xl overflow-hidden bg-white shadow-soft mb-7">
        {cards.map(({ label, value, icon: Icon, href }, index) => (
          <Link key={label} href={href} className={`group relative min-h-28 p-4 sm:p-5 hover:bg-surface-container-low transition-colors ${index < 2 ? "border-b lg:border-b-0" : ""} ${index % 2 === 0 ? "border-r lg:border-r" : ""} border-outline-variant/30`}>
            <Icon className="text-secondary mb-3" size={18} />
            <p className="text-2xl font-bold text-primary leading-none">{loading ? "—" : value}</p>
            <p className="text-xs text-on-surface-variant mt-1.5">{label}</p>
            <ArrowUpRight size={15} className="absolute right-4 top-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      <section className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
          <div>
            <h2 className="font-semibold text-primary">Latest orders</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">The six most recent customer requests</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:text-secondary transition-colors">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <ClipboardList className="mx-auto text-secondary mb-3" size={24} />
            <p className="text-sm text-on-surface-variant">No orders yet. New orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-on-surface-variant border-b border-outline-variant/20">
                  <th className="py-3 px-5 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Phone</th>
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-5 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-outline-variant/10 last:border-0">
                    <td className="py-3 px-5 font-medium">{order.customer_name}</td>
                    <td className="py-3 pr-4">{order.phone}</td>
                    <td className="py-3 pr-4 capitalize">{order.fulfillment_type}</td>
                    <td className="py-3 pr-4">{formatCurrency(order.total_price)}</td>
                    <td className="py-3 pr-5 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
