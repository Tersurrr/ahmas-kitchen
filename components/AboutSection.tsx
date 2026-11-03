import Image from "next/image";
import { Sparkles, Leaf, ChefHat, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const features = [
  { icon: Sparkles, title: "Premium, Fresh Ingredients" },
  { icon: Leaf, title: "Authentic, Bold African Flavors" },
  { icon: ChefHat, title: "Clean, Professional Food Preparation" },
  { icon: HeartHandshake, title: "Excellent Customer Service" },
];

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16 py-section-gap px-4 md:px-gutter max-w-container-max mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-soft heritage-frame">
          <Image
            src="/images/business-overview-food.webp"
            alt="A freshly prepared bowl of African beef stew with greens and peppers"
            fill
            quality={80}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-sm font-bold tracking-widest uppercase text-secondary">About Us</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 mb-5">
            About{" "}
            <span className="font-brand font-semibold text-4xl md:text-5xl tracking-wide">
              Amahs Kitchen
            </span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            {siteConfig.ownerName
              ? `Founded and operated by ${siteConfig.ownerName}, Amahs Kitchen is dedicated`
              : "Amahs Kitchen is dedicated"}{" "}
            to sharing the rich taste of African cuisine through
            carefully prepared meals made with quality ingredients. Every dish reflects our
            commitment to freshness, consistency, and exceptional service. From everyday meals to
            special celebrations, we strive to create a memorable dining experience for every
            customer.
          </p>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-sm font-bold tracking-widest uppercase text-secondary">Why Choose Us</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3">
          Why Choose Amahs kitchen
        </h2>
      </div>
      <ul className="mx-auto max-w-2xl divide-y divide-outline-variant/30 border-y border-outline-variant/30 px-4">
        {features.map((feature) => (
          <li key={feature.title} className="flex items-center gap-4 py-4 sm:py-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/10">
              <feature.icon className="text-secondary" size={21} strokeWidth={1.7} />
            </span>
            <span className="font-display font-semibold text-primary">{feature.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
