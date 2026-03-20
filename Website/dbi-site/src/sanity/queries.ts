import { groq } from "next-sanity";

const ctaFields = `
  label,
  href
`;

export const pageByPathQuery = groq`
  *[_type == "page" && path == $path] | order(_updatedAt desc)[0]{
    title,
    lead,
    description,
    layout,
    content[]{
      _type,
      title,
      subtitle,
      text,
      description,
      placeholder,
      buttonLabel,
      legalText,
      ctaVariant,
      buttonVariant,
      "imageSrc": image.asset->url,
      imageAlt,
      primaryCta{${ctaFields}},
      secondaryCta{${ctaFields}},
      cta{${ctaFields}},
      items[]{
        title,
        description,
        subtitle,
        value,
        label,
        quote,
        attribution,
        "imageSrc": image.asset->url,
        imageAlt,
        href,
        hoverColor
      },
      metrics[]{
        title,
        description,
        value,
        label,
        href,
      },
      "programCta": cta{${ctaFields}},
      "programItems": items[]{
        title,
        description,
        "imageSrc": image.asset->url,
        imageAlt,
        href,
        hoverColor
      },
      "impactMetrics": metrics[]{ value, label, href },
      "testimonialItems": items[]{ quote, attribution },
      "cardItems": items[]{ title, description },
      "imageItems": items[]{ title, subtitle },
      "textCta": cta{${ctaFields}},
      "ctaButton": cta{${ctaFields}}
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "site"][0]{ donateUrl }
`;

export const siteQuery = groq`
  *[_type == "site"][0]{
    organizationName,
    donateUrl,
    primaryNav[]{ label, href },
    footer{
      heading,
      description,
      email,
      siteLinks[]{ label, href },
      socialLinks[]{ label, href },
      partnersTitle,
      newsletterSignup{
        title,
        description,
        placeholder,
        buttonLabel,
        legalText,
        "imageSrc": image.asset->url,
        imageAlt,
        mailchimp{
          listId
        }
      },
      partners[]{
        name,
        "logoSrc": logo.asset->url,
        logoAlt,
        tagline
      }
    }
  }
`;
