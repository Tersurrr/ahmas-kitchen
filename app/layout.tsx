import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amahskitchen.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amahs kitchen",
    template: "%s | Amahs kitchen",
  },
  description:
    "Fresh, flavorful African meals available for pickup and delivery Registered business in the State of Massachusetts.",
  openGraph: {
    title: "Amahs kitchen | Authentic African Cuisine",
    description: "Fresh, flavorful African meals available for pickup and delivery.",
    url: siteUrl,
    siteName: "Amahs kitchen",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="font-body bg-background text-on-surface heritage-pattern antialiased">
        {children}
      </body>
    </html>
  );
}