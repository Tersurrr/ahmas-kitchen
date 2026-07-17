/** Browser-only media preparation utilities used by authenticated admin uploads. */

const MAX_IMAGE_EDGE = 1920;
const IMAGE_QUALITY = 0.82;

function safeBaseName(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]/gi, "-").toLowerCase() || "image";
}

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a valid image file.");
  if (file.type === "image/svg+xml" || file.size < 180 * 1024) return file;

  try {
    const source = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(source, 0, 0, width, height);
    source.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${safeBaseName(file.name)}.webp`, { type: "image/webp", lastModified: file.lastModified });
  } catch {
    // Preserve upload support for formats a browser cannot decode (for example, some HEIC files).
    return file;
  }
}

export async function createVideoThumbnail(file: File): Promise<File> {
  if (!file.type.startsWith("video/")) throw new Error("Please choose a valid video file.");
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  video.src = url;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => { video.currentTime = Math.min(1, Math.max(0, video.duration * 0.1)); };
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("We couldn't generate a thumbnail for this video."));
    });
    const scale = Math.min(1, 960 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.72));
    if (!blob) throw new Error("We couldn't generate a thumbnail for this video.");
    return new File([blob], `${safeBaseName(file.name)}-thumbnail.webp`, { type: "image/webp", lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(url);
    video.removeAttribute("src");
    video.load();
  }
}
