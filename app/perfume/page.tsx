import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Amahs Fragrance & Perfume | A New Scent Story",
  description: "Discover the Amahs Fragrance & Perfume collection, available for pickup and delivery in Dracut, Massachusetts.",
};

export default function PerfumeCampaignPage() {
  return (
    <main className="perfume-page">
      <Image
        src="/images/amahs-fragrance-campaign.png"
        alt="Amahs Fragrance & Perfume campaign featuring a model and Cranford perfume collection, with pickup, delivery, and contact details."
        width={483}
        height={730}
        priority
        sizes="(max-width: 640px) 100vw, 700px"
        className="perfume-page-poster"
      />
    </main>
  );
}

