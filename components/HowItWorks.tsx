import { UtensilsCrossed, MousePointerClick, ClipboardList, MessageCircle, BadgeCheck, ChefHat, Truck } from "lucide-react";

const steps = [
  { icon: UtensilsCrossed, title: "Browse the Menu", description: "Explore our full menu of authentic African dishes online" },
  { icon: MousePointerClick, title: "Select & Order", description: "Choose your favorite dishes and click Order Now" },
  { icon: ClipboardList, title: "Share Your Details", description: "Enter your name, address, phone number, and any special instructions" },
  { icon: MessageCircle, title: "Sent to WhatsApp", description: "Your order goes straight to Amahs Kitchen via WhatsApp" },
  { icon: BadgeCheck, title: "Confirmation & Payment", description: "We confirm availability and send payment options Cash App, Zelle, Stripe, or Apple Pay" },
  { icon: ChefHat, title: "Freshly Prepared", description: "Once payment is confirmed, your meal is freshly prepared" },
  { icon: Truck, title: "Pickup or Delivery", description: "Collect your order or receive it via our delivery service" },
];

export default function HowItWorks() {
  return (
    <section className="py-section-gap px-4 md:px-gutter max-w-container-max mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-widest uppercase text-secondary">How It Works</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3">
          Ordering Made Simple
        </h2>
        <p className="text-on-surface-variant mt-4">
          From browsing to your doorstep here&apos;s exactly how an order with Amah&apos;s Kitchen works
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center mb-5 border-2 border-secondary/20 relative">
              <step.icon className="text-secondary" size={26} />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h4 className="font-semibold text-primary mb-1.5">{step.title}</h4>
            <p className="text-sm text-on-surface-variant">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
