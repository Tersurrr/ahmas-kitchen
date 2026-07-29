const fallbackSiteUrl = "https://amahskitchen.com";
const fallbackFacebookUrl = "https://www.facebook.com/profile.php?id=61582742296659";
const fallbackTikTokUrl = "https://www.tiktok.com/@sandrineamah";

function clean(value: string | undefined) {
  return value?.trim() || "";
}

function siteUrlFromEnvironment() {
  const candidate = clean(process.env.NEXT_PUBLIC_SITE_URL) || fallbackSiteUrl;

  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteConfig = {
  name: "Amahs Kitchen",
  alternateName: "Amah's Kitchen",
  url: siteUrlFromEnvironment(),
  description:
    "Amahs Kitchen is a Massachusetts African food business offering freshly prepared meals, pickup, delivery, catering, and easy online ordering.",
  ownerName: clean(process.env.NEXT_PUBLIC_BUSINESS_OWNER),
  email: clean(process.env.NEXT_PUBLIC_BUSINESS_EMAIL) || "sandrineamah25@gmail.com",
  phone: clean(process.env.NEXT_PUBLIC_BUSINESS_PHONE) || "+1 (857) 261-5923",
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || "18572615923",
  facebookUrl: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL) || fallbackFacebookUrl,
  instagramUrl: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  tiktokUrl: clean(process.env.NEXT_PUBLIC_TIKTOK_URL) || fallbackTikTokUrl,
  priceRange: clean(process.env.NEXT_PUBLIC_PRICE_RANGE) || "$$",
  address: {
    streetAddress: clean(process.env.NEXT_PUBLIC_BUSINESS_STREET_ADDRESS),
    addressLocality: clean(process.env.NEXT_PUBLIC_BUSINESS_CITY),
    addressRegion: clean(process.env.NEXT_PUBLIC_BUSINESS_REGION) || "MA",
    postalCode: clean(process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE),
    addressCountry: clean(process.env.NEXT_PUBLIC_BUSINESS_COUNTRY) || "US",
  },
} as const;

export function restaurantJsonLd() {
  const { address, ownerName, facebookUrl, instagramUrl, tiktokUrl, ...business } = siteConfig;
  const sameAs = [facebookUrl, instagramUrl, tiktokUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${business.url}/#restaurant`,
    name: business.name,
    alternateName: business.alternateName,
    description: business.description,
    url: business.url,
    logo: `${business.url}/images/amahs-kitchen-logo.webp`,
    image: `${business.url}/images/amahs-kitchen-logo.webp`,
    telephone: business.phone,
    email: business.email,
    menu: `${business.url}/menu`,
    priceRange: business.priceRange,
    currenciesAccepted: "USD",
    servesCuisine: "African",
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    areaServed: {
      "@type": "State",
      name: "Massachusetts",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
        "https://schema.org/Saturday",
        "https://schema.org/Sunday",
      ],
      opens: "11:00",
      closes: "19:00",
    },
    ...(ownerName
      ? {
          founder: {
            "@type": "Person",
            name: ownerName,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
