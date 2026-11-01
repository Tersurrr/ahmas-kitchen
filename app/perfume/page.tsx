import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Amahs Fragrance & Perfume — Coming Soon",
  description: "A collection that speaks class and leaves a lasting impression. Amahs Fragrance & Perfume is coming soon.",
};

export default function PerfumeComingSoonPage() {
  return (
    <main className="fixed inset-0 z-[100] grid min-h-[100svh] place-items-center overflow-auto bg-[#fff4df]">
      <Image
        src="/images/amahs-fragrance-coming-soon.jpg"
        alt="Amahs Fragrance & Perfume is coming soon. Pickup and delivery available. Visit amahskitchen.com/perfume, call +1 (857) 261-5923, or visit us in Dracut, Massachusetts."
        width={853}
        height={1280}
        priority
        sizes="(max-width: 853px) 100vw, 853px"
        className="h-auto max-h-[100svh] w-auto max-w-full object-contain"
      />
    </main>
  );
}
