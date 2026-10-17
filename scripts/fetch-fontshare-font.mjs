import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const fontPath = resolve("public/fonts/CabinetGrotesk-Variable.woff2");

try {
  const existingFont = await readFile(fontPath);
  if (existingFont.subarray(0, 4).toString("ascii") === "wOF2") process.exit(0);
} catch {
  // A missing or invalid local copy is downloaded from the official Fontshare API.
}

const cssResponse = await fetch(
  "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1&display=swap",
  { signal: AbortSignal.timeout(15_000) },
);
if (!cssResponse.ok) {
  throw new Error(`Fontshare CSS request failed (${cssResponse.status})`);
}

const css = await cssResponse.text();
const fontUrlMatch = css.match(
  /url\(['"]?(\/\/cdn\.fontshare\.com\/[^)'"\s]+\.woff2)['"]?\)\s*format\(['"]woff2['"]\)/,
);
if (!fontUrlMatch) throw new Error("Fontshare did not return a Cabinet Grotesk WOFF2 file");

const fontResponse = await fetch(new URL(fontUrlMatch[1], "https://api.fontshare.com"), {
  signal: AbortSignal.timeout(15_000),
});
if (!fontResponse.ok) {
  throw new Error(`Cabinet Grotesk download failed (${fontResponse.status})`);
}

const font = Buffer.from(await fontResponse.arrayBuffer());
if (font.subarray(0, 4).toString("ascii") !== "wOF2") {
  throw new Error("Fontshare returned an invalid WOFF2 file");
}

await mkdir(dirname(fontPath), { recursive: true });
await writeFile(fontPath, font);
