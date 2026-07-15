import type { Metadata } from "next";

const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "sandrineamah25@gmail.com";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1 (857) 261-5923";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description: "How Amahs kitchen uses cookies and browser storage.",
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

export default function CookieNoticePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-gutter py-12">
      <span className="text-xs font-bold tracking-widest uppercase text-secondary">Legal</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 mb-2">
        Cookie Notice
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">Last updated: July 14, 2026</p>

      <Section title="What this covers">
        <p>
          This page explains the cookies and browser storage this site uses. When you
          first visit, we show a short notice about this so you&rsquo;re aware dismissing
          it just hides the notice and doesn&rsquo;t change how the site works.
        </p>
      </Section>

      <Section title="What we use cookies and local storage for">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Keeping your cart working.</strong> Items you add to your cart are stored in your browser so they&rsquo;re still there as you keep browsing.</li>
          <li><strong>Remembering simple preferences.</strong> Things like whether you&rsquo;ve seen our welcome message or this cookie notice, so we don&rsquo;t show them again.</li>
          <li><strong>Keeping staff signed in.</strong> Our admin dashboard uses a sign-in cookie so staff stay logged in securely.</li>
        </ul>
        <p>We do not use these cookies to track you across other websites, and we do not sell any information collected this way.</p>
      </Section>

      <Section title="Managing cookies">
        <p>
          TheWhat this coversse cookies are necessary for the site&rsquo;s cart and sign-in features to work.
          If you&rsquo;d like to clear them, you can do so at any time through your browser&rsquo;s
          settings (usually under &quot;Clear browsing data&quot; or &quot;Site settings&quot;). Clearing
          them will empty your cart and sign you out of the admin dashboard if you&rsquo;re signed in
        </p>
      </Section>

      <Section title="Questions">
        <p>
          If you have any questions about this notice, reach us at{" "}
          <a href={`mailto:${EMAIL}`} className="font-medium text-secondary hover:underline">{EMAIL}</a>{" "}
          or {PHONE_DISPLAY}.
        </p>
      </Section>
    </div>
  );
}
