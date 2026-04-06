import Script from "next/script";
import { absoluteUrl } from "@/lib/site-url";
import { sanityClient } from "@/sanity/client";
import { siteStructuredDataQuery } from "@/sanity/queries";

type SiteFooter = {
  email?: string;
  phone?: string;
  socialLinks?: { href?: string }[];
};

function parseOrgSameAsFromEnv(): string[] {
  const raw = process.env.NEXT_PUBLIC_ORG_SAME_AS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function StructuredData() {
  const site = await sanityClient
    .fetch<{ footer?: SiteFooter } | null>(siteStructuredDataQuery)
    .catch(() => null);

  const base = absoluteUrl("/");
  const orgId = `${base}#organization`;
  const webId = `${base}#website`;

  const socialFromCms = (site?.footer?.socialLinks ?? [])
    .map((l) => l?.href?.trim())
    .filter((h): h is string => !!h && /^https?:\/\//i.test(h));

  const sameAs = [...new Set([...socialFromCms, ...parseOrgSameAsFromEnv()])];

  const email = site?.footer?.email?.trim();
  const phone = site?.footer?.phone?.trim();

  const contactPoint = [
    {
      "@type": "ContactPoint" as const,
      contactType: "customer service",
      ...(email ? { email } : { email: "damonjhastings@gmail.com" }),
      ...(phone ? { telephone: phone } : {}),
      availableLanguage: ["English"],
    },
  ];

  const organization = {
    "@type": "NGO" as const,
    "@id": orgId,
    name: "Delta Bay Impact",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth in Contra Costa County.",
    url: base,
    logo: absoluteUrl("/dbi_logo.png"),
    foundingDate: "2023",
    areaServed: {
      "@type": "Place",
      name: "Contra Costa County, California",
      address: {
        "@type": "PostalAddress",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint,
    serviceArea: {
      "@type": "Place",
      name: "Contra Costa County",
    },
    nonprofitStatus: "Nonprofit",
    keywords:
      "African American youth support, educational equity, student mentorship, culturally responsive programs, Contra Costa County",
  };

  const website = {
    "@type": "WebSite" as const,
    "@id": webId,
    url: base,
    name: "Delta Bay Impact",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth in Contra Costa County.",
    publisher: { "@id": orgId },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
