import Image from "next/image";
import { Sparkles, Leaf, ChefHat, HeartHandshake, Check } from "lucide-react";

const checklist = [
  "Traditional African flavors, prepared with care",
  "Fresh ingredients in every meal",
  "Convenient pickup and delivery options",
  "Catering for birthdays, weddings, and special occasions",
  "Generous portions with consistent quality",
  "Friendly, reliable customer service",
];

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
            src="https://images.unsplash.com/photo-1583224964978-2257b960c3d3?q=80&w=1200&auto=format&fit=crop"
            alt="Freshly prepared African dishes at Amahs kitchen"
            fill
            quality={80}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-secondary">About Us</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 mb-5">
            About{" "}
            <span className="font-brand font-semibold text-4xl md:text-5xl tracking-wide">
              Amahs Kitchen
            </span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Amahs Kitchen is dedicated to sharing the rich taste of African cuisine through
            carefully prepared meals made with quality ingredients. Every dish reflects our
            commitment to freshness, consistency, and exceptional service. From everyday meals to
            special celebrations, we strive to create a memorable dining experience for every
            customer.
          </p>
          <ul className="mt-6 space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                  <Check className="text-secondary" size={14} strokeWidth={2.5} />
                </span>
                <span className="text-on-surface-variant leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold tracking-widest uppercase text-secondary">Why Choose Us</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3">
          Why Choose Amahs kitchen
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`flex flex-col items-center text-center px-6 py-4 ${
              i > 0 ? "sm:border-l border-outline-variant/30" : ""
            } ${i === 2 ? "border-l-0 lg:border-l" : ""}`}
          >
            <f.icon className="text-secondary mb-4" size={30} strokeWidth={1.5} />
            <p className="font-display font-semibold text-primary">{f.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
