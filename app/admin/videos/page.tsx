"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Video } from "@/lib/types";
import { Plus, Pencil, Trash2, X, UploadCloud } from "lucide-react";
import { createVideoThumbnail } from "@/lib/client-media";

type FormState = {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
};

const emptyForm: FormState = { title: "", description: "", video_url: "", thumbnail_url: "" };

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("sort_order");
    setVideos((data as Video[]) || []);
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

  function openEdit(v: Video) {
    setForm({
      id: v.id,
      title: v.title,
      description: v.description || "",
      video_url: v.video_url,
      thumbnail_url: v.thumbnail_url || "",
    });
    setError("");
    setFormOpen(true);
  }

  async function handleVideoUpload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please choose a valid video file.");
      return;
    }
    setUploadingVideo(true);
    setUploadProgress(0);
    setError("");
    const path = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

    // Supabase JS v2 doesn't expose granular progress; show an indeterminate pulse via 90% cap.
    setUploadProgress(30);
    const { error: uploadError } = await supabase.storage.from("videos").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
    setUploadProgress(90);

    if (uploadError) {
      setError(
        `Video upload failed: ${uploadError.message}. Check that the "videos" storage bucket exists in Supabase, the file is under your plan's size limit (50MB on the free tier), and that you're logged in.`
      );
    } else {
      const { data } = supabase.storage.from("videos").getPublicUrl(path);
      setForm((f) => ({ ...f, video_url: data.publicUrl }));
      // Generate and upload a compact WebP poster while the source video is still local.
      // Video playback stays lazy on the public site, so it is never downloaded until tapped.
      try {
        setUploadingThumb(true);
        const thumbnail = await createVideoThumbnail(file);
        const thumbnailPath = `${Date.now()}-${crypto.randomUUID()}-${thumbnail.name}`;
        const { error: thumbnailError } = await supabase.storage.from("video-thumbnails").upload(thumbnailPath, thumbnail, {
          cacheControl: "31536000",
          contentType: thumbnail.type,
          upsert: false,
        });
        if (thumbnailError) throw thumbnailError;
        const { data: thumbnailData } = supabase.storage.from("video-thumbnails").getPublicUrl(thumbnailPath);
        setForm((f) => ({ ...f, thumbnail_url: thumbnailData.publicUrl }));
      } catch {
        setError("Video uploaded, but its thumbnail could not be generated. You can upload one manually below.");
      } finally {
        setUploadingThumb(false);
      }
    }
    setUploadProgress(100);
    setTimeout(() => setUploadingVideo(false), 400);
  }

  async function handleThumbUpload(file: File | null) {
    if (!file) return;
    setUploadingThumb(true);
    setError("");
    let optimizedFile: File;
    try {
      const { compressImage } = await import("@/lib/client-media");
      optimizedFile = await compressImage(file);
    } catch {
      setError("Please choose a valid image file for the thumbnail.");
      setUploadingThumb(false);
      return;
    }
    const path = `${Date.now()}-${crypto.randomUUID()}-${optimizedFile.name}`;
    const { error: uploadError } = await supabase.storage.from("video-thumbnails").upload(path, optimizedFile, {
      cacheControl: "31536000",
      contentType: optimizedFile.type,
      upsert: false,
    });
    if (uploadError) {
      setError(`Thumbnail upload failed: ${uploadError.message}`);
    } else {
      const { data } = supabase.storage.from("video-thumbnails").getPublicUrl(path);
      setForm((f) => ({ ...f, thumbnail_url: data.publicUrl }));
    }
    setUploadingThumb(false);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Please enter a title for this video.");
      return;
    }
    if (uploadingVideo || uploadingThumb) {
      setError("Please wait for the upload to finish before saving.");
      return;
    }
    if (!form.video_url) {
      setError("Please upload a video file before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        video_url: form.video_url,
        thumbnail_url: form.thumbnail_url || null,
      };

      if (form.id) {
        const { error: updateError } = await supabase.from("videos").update(payload).eq("id", form.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("videos")
          .insert({ ...payload, sort_order: videos.length + 1 });
        if (insertError) throw insertError;
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
    if (!confirm("Delete this video?")) return;
    await supabase.from("videos").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">Videos</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> Upload Video
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading…</p>
        ) : videos.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No videos yet.</p>
        ) : (
          videos.map((v) => (
            <div key={v.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="relative aspect-video bg-surface-container-high">
                {v.thumbnail_url && <Image src={v.thumbnail_url} alt={v.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary">{v.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{v.description}</p>
                <div className="flex justify-end gap-1 mt-3">
                  <button onClick={() => openEdit(v)} className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                    <Trash2 size={15} />
                  </button>
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
              <h2 className="font-semibold text-primary">{form.id ? "Edit Video" : "New Video"}</h2>
              <button onClick={() => setFormOpen(false)}><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Video title"
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
                rows={2}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2 block">
                  Video File
                </label>
                {form.video_url && <p className="text-xs text-secondary mb-2 truncate">Uploaded ✓</p>}
                {uploadingVideo && (
                  <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-secondary transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
                <label className="flex items-center gap-2 justify-center border-2 border-dashed border-outline-variant rounded-lg py-4 cursor-pointer hover:bg-surface-container-low transition-colors text-sm text-on-surface-variant">
                  <UploadCloud size={16} />
                  {uploadingVideo ? "Uploading…" : "Upload video file"}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2 block">
                  Thumbnail
                </label>
                {form.thumbnail_url && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden mb-2 border border-outline-variant/30">
                    <Image src={form.thumbnail_url} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                )}
                <label className="flex items-center gap-2 justify-center border-2 border-dashed border-outline-variant rounded-lg py-4 cursor-pointer hover:bg-surface-container-low transition-colors text-sm text-on-surface-variant">
                  <UploadCloud size={16} />
                  {uploadingThumb ? "Uploading…" : "Upload thumbnail image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleThumbUpload(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-5 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Video"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
