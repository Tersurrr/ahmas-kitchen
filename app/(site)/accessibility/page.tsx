import type { Metadata } from "next";

const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "sandrineamah25@gmail.com";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1 (857) 261-5923";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Amahs kitchen's commitment to an accessible website.",
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

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-gutter py-12">
      <span className="text-xs font-bold tracking-widest uppercase text-secondary">Legal</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 mb-2">
        Accessibility
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">Last updated: July 14, 2026</p>

      <Section title="Our commitment">
        <p>
          Amahs kitchen is committed to making our website accessible and easy to use for
          everyone, including customers who use assistive technology such as screen
          readers, keyboard navigation, or voice control. We work to design and build the
          site with accessibility in mind and to keep improving it over time.
        </p>
      </Section>

      <Section title="What we do">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Keyboard navigation:</strong> menus, buttons, and interactive elements like the menu cards and cart can be reached and used with a keyboard.</li>
          <li><strong>Color contrast:</strong> text and interactive elements are designed to have sufficient contrast against their backgrounds.</li>
          <li><strong>Image alt text:</strong> meaningful images include descriptive alt text for screen readers.</li>
          <li><strong>Heading structure:</strong> pages use a logical heading order to make content easy to navigate and understand.</li>
          <li><strong>ARIA labels:</strong> icon-only buttons and controls (like closing a modal or opening the cart) include descriptive labels for assistive technology.</li>
          <li><strong>Visible focus indicators:</strong> interactive elements show a clear focus outline when navigated to with a keyboard.</li>
          <li><strong>Responsive layout:</strong> the site adapts to different screen sizes and supports browser text resizing.</li>
        </ul>
      </Section>

      <Section title="Ongoing work">
        <p>
          Accessibility is an ongoing effort. If you encounter any part of the site that
          is difficult to use, we want to know about it so we can fix it.
        </p>
      </Section>

      <Section title="Report an issue">
        <p>
          If you experience any accessibility barriers on this website, please contact us
          at{" "}
          <a href={`mailto:${EMAIL}`} className="font-medium text-secondary hover:underline">{EMAIL}</a>{" "}
          or {PHONE_DISPLAY}, and we&rsquo;ll do our best to address it promptly.
        </p>
      </Section>
    </div>
  );
}
