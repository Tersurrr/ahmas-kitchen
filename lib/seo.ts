import type { Metadata } from "next";
import type { Category, MenuItem, Video } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

const socialImagePath = "/images/amahs-kitchen-social-card.jpg";
const cuisineTypes = ["African"];
const serviceDays = [
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

type Breadcrumb = {
  name: string;
  path: string;
};

type WebPageStructuredDataInput = {
  name: string;
  description: string;
  path: string;
  breadcrumbs: Breadcrumb[];
  pageType?: "WebPage" | "AboutPage" | "CollectionPage";
  primaryImageUrl?: string;
};

function absoluteUrl(path: string) {
  try {
    return new URL(path, `${siteConfig.url}/`).toString();
  } catch {
    return siteConfig.url;
  }
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    ...(siteConfig.address.streetAddress
      ? { streetAddress: siteConfig.address.streetAddress }
      : {}),
    ...(siteConfig.address.addressLocality
      ? { addressLocality: siteConfig.address.addressLocality }
      : {}),
    addressRegion: siteConfig.address.addressRegion,
    ...(siteConfig.address.postalCode
      ? { postalCode: siteConfig.address.postalCode }
      : {}),
    addressCountry: siteConfig.address.addressCountry,
  };
}

function socialImage() {
  return {
    url: socialImagePath,
    width: 1200,
    height: 630,
    alt: "Amahs Kitchen authentic African cuisine in Massachusetts",
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [socialImage()],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImagePath],
    },
  };
}

export function siteStructuredData() {
  const logoUrl = absoluteUrl("/images/amahs-kitchen-logo.webp");
  const socialImageUrl = absoluteUrl(socialImagePath);
  const sameAs = [
    siteConfig.facebookUrl,
    siteConfig.instagramUrl,
    siteConfig.tiktokUrl,
  ].filter(Boolean);
  const address = postalAddress();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        url: logoUrl,
        contentUrl: logoUrl,
        width: 512,
        height: 512,
        caption: `${siteConfig.name} logo`,
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        url: siteConfig.url,
        description: siteConfig.description,
        logo: {
          "@id": `${siteConfig.url}/#logo`,
        },
        image: socialImageUrl,
        thumbnailUrl: socialImageUrl,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: siteConfig.phone,
          email: siteConfig.email,
          areaServed: "US",
          availableLanguage: ["English"],
        },
        ...(siteConfig.ownerName
          ? {
              founder: {
                "@type": "Person",
                name: siteConfig.ownerName,
              },
            }
          : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "Restaurant",
        "@id": `${siteConfig.url}/#restaurant`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        url: siteConfig.url,
        description: siteConfig.description,
        logo: {
          "@id": `${siteConfig.url}/#logo`,
        },
        image: [socialImageUrl, logoUrl],
        thumbnailUrl: socialImageUrl,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address,
        parentOrganization: {
          "@id": `${siteConfig.url}/#organization`,
        },
        priceRange: siteConfig.priceRange,
        currenciesAccepted: "USD",
        paymentAccepted: "Cash App, Zelle, Stripe, Apple Pay",
        servesCuisine: cuisineTypes,
        slogan: "Authentic African Cuisine, Freshly Prepared",
        knowsAbout: [
          "African cuisine",
          "African catering",
          "African food pickup",
          "African food delivery",
        ],
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Massachusetts",
        },
        openingHours: "Tu-Su 11:00-19:00",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: serviceDays,
          opens: "11:00",
          closes: "19:00",
        },
        menu: absoluteUrl("/menu"),
        hasMenu: {
          "@id": `${absoluteUrl("/menu")}#menu`,
        },
        potentialAction: {
          "@type": "OrderAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteUrl("/menu"),
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
            ],
          },
          deliveryMethod: [
            "https://purl.org/goodrelations/v1#DeliveryModePickUp",
            "https://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
          ],
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        description: siteConfig.description,
        image: socialImageUrl,
        thumbnailUrl: socialImageUrl,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        inLanguage: "en-US",
      },
    ],
  };
}

export function webPageStructuredData({
  name,
  description,
  path,
  breadcrumbs,
  pageType = "WebPage",
  primaryImageUrl = socialImagePath,
}: WebPageStructuredDataInput) {
  const pageUrl = absoluteUrl(path);
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const pageImageUrl = absoluteUrl(primaryImageUrl);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": pageType,
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        about: {
          "@id": `${siteConfig.url}/#restaurant`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          "@id": `${pageUrl}#primaryimage`,
          url: pageImageUrl,
          contentUrl: pageImageUrl,
          caption: `${name} image`,
        },
        image: pageImageUrl,
        thumbnailUrl: pageImageUrl,
        breadcrumb: {
          "@id": breadcrumbId,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: breadcrumb.name,
          item: absoluteUrl(breadcrumb.path),
        })),
      },
    ],
  };
}

function offersForMenuItem(item: MenuItem) {
  const options = [...(item.menu_item_options ?? [])]
    .filter((option) => Number.isFinite(Number(option.price)))
    .sort((a, b) => a.sort_order - b.sort_order);
  const prices = options.length
    ? options.map((option) => Number(option.price))
    : [Number(item.price)];

  if (prices.length === 1) {
    return {
      "@type": "Offer",
      price: prices[0].toFixed(2),
      priceCurrency: "USD",
      availability: item.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      seller: {
        "@id": `${siteConfig.url}/#restaurant`,
      },
    };
  }

  return {
    "@type": "AggregateOffer",
    lowPrice: Math.min(...prices).toFixed(2),
    highPrice: Math.max(...prices).toFixed(2),
    offerCount: prices.length,
    priceCurrency: "USD",
    offers: options.map((option) => ({
      "@type": "Offer",
      name: `${item.name} - ${option.name}`,
      price: Number(option.price).toFixed(2),
      priceCurrency: "USD",
      availability: item.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      seller: {
        "@id": `${siteConfig.url}/#restaurant`,
      },
    })),
  };
}

export function menuStructuredData(categories: Category[], items: MenuItem[]) {
  const sections = categories
    .map((category) => ({
      category,
      items: items.filter((item) => item.category_id === category.id),
    }))
    .filter((section) => section.items.length > 0);
  const categorizedIds = new Set(
    sections.flatMap((section) => section.items.map((item) => item.id)),
  );
  const uncategorizedItems = items.filter((item) => !categorizedIds.has(item.id));

  if (uncategorizedItems.length) {
    sections.push({
      category: {
        id: "other-menu-items",
        name: "More from the Menu",
        slug: "more",
        sort_order: Number.MAX_SAFE_INTEGER,
      },
      items: uncategorizedItems,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${absoluteUrl("/menu")}#menu`,
    url: absoluteUrl("/menu"),
    name: `${siteConfig.name} African Food Menu`,
    description:
      "Freshly prepared African dishes available for pickup, delivery, and catering in Massachusetts.",
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@id": `${absoluteUrl("/menu")}#webpage`,
    },
    provider: {
      "@id": `${siteConfig.url}/#restaurant`,
    },
    hasMenuSection: sections.map(({ category, items: sectionItems }) => ({
      "@type": "MenuSection",
      "@id": `${absoluteUrl("/menu")}#category-${category.slug}`,
      name: category.name,
      hasMenuItem: sectionItems.map((item) => ({
        "@type": "MenuItem",
        "@id": `${absoluteUrl("/menu")}#menu-item-${item.id}`,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.menu_images?.[0]?.url
          ? { image: absoluteUrl(item.menu_images[0].url) }
          : {}),
        category: category.name,
        offers: offersForMenuItem(item),
      })),
    })),
  };
}

export function videosStructuredData(videos: Video[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl("/videos")}#video-list`,
    name: `${siteConfig.name} Kitchen Videos`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: videos.length,
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        "@id": `${absoluteUrl("/videos")}#video-${video.id}`,
        name: video.title,
        description:
          video.description ||
          `${siteConfig.name} African food preparation and cooking video.`,
        contentUrl: video.video_url,
        uploadDate: new Date(video.created_at).toISOString(),
        ...(video.thumbnail_url
          ? { thumbnailUrl: [absoluteUrl(video.thumbnail_url)] }
          : {}),
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        inLanguage: "en-US",
        isFamilyFriendly: true,
      },
    })),
  };
}
