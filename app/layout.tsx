import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "Amahs Kitchen | African Restaurant in Massachusetts",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Amahs Kitchen",
    "Amah's Kitchen",
    "African restaurant Massachusetts",
    "African food Massachusetts",
    "African catering Massachusetts",
    "African food pickup and delivery",
    ...(siteConfig.ownerName ? [siteConfig.ownerName] : []),
  ],
  creator: siteConfig.ownerName || siteConfig.name,
  authors: [
    {
      name: siteConfig.ownerName || siteConfig.name,
      url: siteConfig.url,
    },
  ],
  publisher: siteConfig.name,
  category: "restaurant",
  referrer: "origin-when-cross-origin",
  manifest: "/site.webmanifest",
  icons: {
    icon: {
      url: "/favicon.ico",
      type: "image/x-icon",
      sizes: "64x64",
    },
    apple: {
      url: "/images/amahs-kitchen-logo.webp",
      type: "image/webp",
      sizes: "512x512",
    },
  },
  openGraph: {
    title: "Amahs Kitchen | Authentic African Cuisine",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/amahs-kitchen-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "Amahs Kitchen authentic African cuisine in Massachusetts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amahs Kitchen | Authentic African Cuisine",
    description: siteConfig.description,
    images: ["/images/amahs-kitchen-social-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-body bg-background text-on-surface heritage-pattern antialiased">
        {children}
      </body>
    </html>
  );
}
