"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { Plus, Pencil, Trash2, GripVertical, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");

  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories((data as Category[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setName("");
    setFormOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setName(c.name);
    setFormOpen(true);
  }

  function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    if (!name.trim()) return;
    if (editing) {
      await supabase.from("categories").update({ name, slug: slugify(name) }).eq("id", editing.id);
    } else {
      const sort_order = categories.length + 1;
      await supabase.from("categories").insert({ name, slug: slugify(name), sort_order });
    }
    setFormOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Menu items in it will become uncategorized.")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  async function move(id: string, direction: -1 | 1) {
    const idx = categories.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    const a = categories[idx];
    const b = categories[swapIdx];
    await Promise.all([
      supabase.from("categories").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">Categories</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-soft divide-y divide-outline-variant/10">
        {loading ? (
          <p className="p-5 text-sm text-on-surface-variant">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="p-5 text-sm text-on-surface-variant">No categories yet.</p>
        ) : (
          categories.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-on-surface-variant">
                  <button disabled={i === 0} onClick={() => move(c.id, -1)} className="disabled:opacity-30">▲</button>
                  <button disabled={i === categories.length - 1} onClick={() => move(c.id, 1)} className="disabled:opacity-30">▼</button>
                </div>
                <GripVertical size={16} className="text-on-surface-variant" />
                <span className="font-medium text-on-surface">{c.name}</span>
                <span className="text-xs text-on-surface-variant">/{c.slug}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-primary">{editing ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setFormOpen(false)}><X size={18} /></button>
            </div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
            />
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
