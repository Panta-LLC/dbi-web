import Script from "next/script";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Delta Bay Impact",
    description:
      "We partner with schools and families to provide mentorship, academic support, and advocacy that creates pathways to belonging, confidence, and success for African American youth in Contra Costa County.",
    url: "https://dbi-site.vercel.app",
    logo: "https://dbi-site.vercel.app/dbi_logo.png",
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
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "info@deltabayimpact.org",
        contactType: "General Inquiries",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "Partnership Inquiries",
        description: "For schools and districts interested in partnership",
      },
      {
        "@type": "ContactPoint",
        contactType: "Volunteer Opportunities",
        description: "For individuals interested in becoming mentors",
      },
    ],
    serviceArea: {
      "@type": "Place",
      name: "Contra Costa County",
    },
    nonprofitStatus: "Nonprofit",
    keywords:
      "African American youth support, educational equity, student mentorship, culturally responsive programs, Contra Costa County",
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
