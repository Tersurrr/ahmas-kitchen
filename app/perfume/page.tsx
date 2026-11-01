import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Amahs Fragrance & Perfume — Coming Soon",
  description: "A collection that speaks class and leaves a lasting impression. Amahs Fragrance & Perfume is coming soon.",
};

export default function PerfumeComingSoonPage() {
  return (
    <main className="perfume-coming-soon">
      <Image
        src="/images/amahs-fragrance-coming-soon.jpg"
        alt="Amahs Fragrance & Perfume is coming soon. Pickup and delivery available. Visit amahskitchen.com/perfume, call +1 (857) 261-5923, or visit us in Dracut, Massachusetts."
        width={853}
        height={1280}
        priority
        sizes="(max-width: 853px) 100vw, 853px"
        className="perfume-coming-soon-poster"
      />
    </main>
  );
}

