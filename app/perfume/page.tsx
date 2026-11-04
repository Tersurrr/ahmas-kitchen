import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Amahs Fragrance & Perfume — Coming Soon",
  description: "Amahs Fragrance & Perfume is coming soon to Dracut, Massachusetts. Pickup and delivery will be available.",
};

export default function PerfumeCampaignPage() {
  return (
    <main className="perfume-page">
      <p className="perfume-coming-soon-label">
        <span className="perfume-coming-soon-dot" aria-hidden="true" />
        Coming very soon
      </p>
      <div className="perfume-poster-frame">
        <Image
          src="/images/amahs-fragrance-campaign.png"
          alt="Amahs Fragrance & Perfume campaign featuring a model and Cranford perfume collection, with pickup, delivery, and contact details."
          width={483}
          height={730}
          priority
          sizes="(max-width: 640px) 100vw, 483px"
          className="perfume-page-poster"
        />
      </div>
    </main>
  );
}

