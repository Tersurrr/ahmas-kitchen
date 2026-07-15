import type { Metadata } from "next";

const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "sandrineamah25@gmail.com";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1 (857) 261-5923";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Amahs kitchen collects, uses, and protects your information.",
  robots: { index: true, follow: true },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-xl font-bold text-primary mb-3">{title}</h2>
      <div className="text-sm leading-7 text-on-surface-variant space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-gutter py-12">
      <span className="text-xs font-bold tracking-widest uppercase text-secondary">Legal</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">Last updated: July 14, 2026</p>

      <Section title="Who we are">
        <p>
          Amahs kitchen (&quot;we&quot;, &quot;us&quot;) is a US-based restaurant that accepts
          pickup and delivery orders through this website. This policy explains what
          information we collect from our customers, why we collect it, and how you can
          reach us with any questions.
        </p>
      </Section>

      <Section title="Information we collect">
        <p><strong>Order details you provide.</strong> When you check out, we collect your name and phone number, plus a delivery address (for delivery orders), preferred date/time, and any special instructions, so we can process and fulfill your order.</p>
        <p><strong>Cart and site preferences.</strong> Your cart contents and a few simple preferences (like whether you&rsquo;ve seen our welcome message or cookie notice) are stored directly in your browser&rsquo;s local storage. This stays on your device and is not sent to us until you check out.</p>
        <p><strong>Admin access.</strong> If you are a staff member logging into the admin dashboard, an authentication cookie keeps you securely signed in.</p>
      </Section>

      <Section title="How we use your information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To process, confirm, and fulfill your pickup or delivery order</li>
          <li>To contact you about your order (by phone or WhatsApp) if something needs clarifying</li>
          <li>To provide customer support if you reach out with a question</li>
          <li>To keep basic order records for accounting and food-safety purposes</li>
        </ul>
        <p>We only use your name and phone number for these purposes order processing, customer communication, and support</p>
      </Section>

      <Section title="How we protect and share your information">
        <p>
          Your information is stored securely using Supabase, our database provider, and
          your order is sent to us via WhatsApp when you complete checkout. We do not sell
          your personal information. We only share it with the service providers named
          above as needed to run the business, or where required to complete your order
          or comply with the law.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          This site uses cookies and browser local storage to keep your cart working and
          to remember simple preferences. See our{" "}
          <a href="/cookies" className="font-medium text-secondary hover:underline">Cookie Notice</a>{" "}
          for details.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          We keep order records for as long as reasonably needed for accounting, customer
          service, and legal requirements, and delete them when no longer needed. Cart and
          preference data in your browser stays until you clear your browser storage.
        </p>
      </Section>

      <Section title="Children">
        <p>Our services are intended for adults placing food orders and are not directed at children.</p>
      </Section>

      <Section title="Changes to this policy">
        <p>We may update this policy from time to time. The &quot;Last updated&quot; date above will reflect any changes.</p>
      </Section>

      <Section title="Contact us">
        <p>
          If you have any questions about your personal information or this policy, reach
          us at{" "}
          <a href={`mailto:${EMAIL}`} className="font-medium text-secondary hover:underline">{EMAIL}</a>{" "}
          or {PHONE_DISPLAY}.
        </p>
      </Section>
    </div>
  );
}
