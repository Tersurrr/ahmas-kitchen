"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category, MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { Plus, Pencil, Trash2, X, UploadCloud } from "lucide-react";
import { compressImage } from "@/lib/client-media";

type FormState = {
  id?: string;
  name: string;
  description: string;
  ingredients: string;
  price: string;
  category_id: string;
  is_featured: boolean;
  is_available: boolean;
  images: string[]; // existing image URLs
};

const emptyForm: FormState = {
  name: "",
  description: "",
  ingredients: "",
  price: "",
  category_id: "",
  is_featured: false,
  is_available: true,
  images: [],
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function load() {
    setLoading(true);
    const [itemsRes, categoriesRes] = await Promise.all([
      supabase.from("menu_items").select("*, menu_images(*)").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setItems((itemsRes.data as unknown as MenuItem[]) || []);
    setCategories((categoriesRes.data as Category[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  }

  function openEdit(item: MenuItem) {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description || "",
      ingredients: item.ingredients || "",
      price: String(item.price),
      category_id: item.category_id || "",
      is_featured: item.is_featured,
      is_available: item.is_available,
      images: item.menu_images?.map((i) => i.url) || [],
    });
    setError("");
    setFormOpen(true);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];
    const failures: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const optimizedFile = await compressImage(file);
        const path = `${Date.now()}-${crypto.randomUUID()}-${optimizedFile.name}`;
        const { error: uploadError } = await supabase.storage.from("menu-images").upload(path, optimizedFile, {
          cacheControl: "31536000",
          contentType: optimizedFile.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      } catch {
        failures.push(file.name);
      }
    }

    if (uploaded.length > 0) {
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    }
    if (failures.length > 0) {
      setError(
        `Couldn't upload ${failures.join(", ")}. Check that the "menu-images" storage bucket exists in Supabase and that you're logged in.`
      );
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Please enter a name for this item.");
      return;
    }
    if (!form.price) {
      setError("Please enter a price for this item.");
      return;
    }
    if (uploading) {
      setError("Please wait for the image upload to finish before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        ingredients: form.ingredients || null,
        price: parseFloat(form.price),
        category_id: form.category_id || null,
        is_featured: form.is_featured,
        is_available: form.is_available,
      };

      let itemId = form.id;

      if (itemId) {
        const { error: updateError } = await supabase.from("menu_items").update(payload).eq("id", itemId);
        if (updateError) throw updateError;
        const { error: deleteImagesError } = await supabase
          .from("menu_images")
          .delete()
          .eq("menu_item_id", itemId);
        if (deleteImagesError) throw deleteImagesError;
      } else {
        const { data, error: insertError } = await supabase
          .from("menu_items")
          .insert({ ...payload, sort_order: items.length + 1 })
          .select()
          .single();
        if (insertError) throw insertError;
        itemId = data?.id;
      }

      if (itemId && form.images.length > 0) {
        const { error: imagesError } = await supabase.from("menu_images").insert(
          form.images.map((url, i) => ({ menu_item_id: itemId, url, sort_order: i }))
        );
        if (imagesError) throw imagesError;
      }

      setFormOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    load();
  }

  async function toggleAvailable(item: MenuItem) {
    await supabase.from("menu_items").update({ is_available: !item.is_available }).eq("id", item.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">Menu Items</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No menu items yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="relative aspect-video bg-surface-container-high">
                {item.menu_images?.[0] && (
                  <Image src={item.menu_images[0].url} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                )}
                {!item.is_available && (
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Unavailable
                  </span>
                )}
                {item.is_featured && (
                  <span className="absolute top-2 right-2 bg-secondary text-on-secondary text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary">{item.name}</h3>
                  <span className="text-sm font-semibold">{formatCurrency(item.price)}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className="text-xs font-medium text-secondary hover:underline"
                  >
                    Mark {item.is_available ? "Unavailable" : "Available"}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-lg p-6 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-primary">{form.id ? "Edit Item" : "New Item"}</h2>
              <button onClick={() => setFormOpen(false)}><X size={18} /></button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Item name"
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <textarea
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                placeholder="Ingredients (optional)"
                rows={2}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                  />
                  Available
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2 block">
                  Images
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((url) => (
                    <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/30">
                      <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 justify-center border-2 border-dashed border-outline-variant rounded-lg py-4 cursor-pointer hover:bg-surface-container-low transition-colors text-sm text-on-surface-variant">
                  <UploadCloud size={16} />
                  {uploading ? "Uploading…" : "Upload images"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                </label>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full mt-3 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : uploading ? "Waiting for upload…" : "Save Item"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
