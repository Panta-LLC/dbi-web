import { groq } from "next-sanity";

const ctaFields = `
  label,
  href
`;

const contactFormFields = `
  firstNamePlaceholder,
  lastNamePlaceholder,
  emailPlaceholder,
  organizationPlaceholder,
  messagePlaceholder,
  submitLabel
`;

const ctaActionFields = `
  kind,
  label,
  href,
  formId,
  messageContext,
  modalTitle,
  modalDescription,
  presentation,
  successMessage,
  contactForm{${contactFormFields}}
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
      columnsPerRow,
      expandedMode,
      sectionLayout,
      defaultView,
      cardSize,
      "image": image{ crop, hotspot, asset },
      "imageSrc": image.asset->url,
      imageAlt,
      "leftImage": leftImage{ crop, hotspot, asset },
      "leftImageSrc": leftImage.asset->url,
      leftImageAlt,
      "galleryImages": galleryImages[]{
        "image": image{ crop, hotspot, asset },
        "imageSrc": image.asset->url,
        imageAlt
      },
      primaryCta{${ctaFields}},
      secondaryCta{${ctaFields}},
      imagePosition,
      backgroundColor,
      ctas[]{${ctaFields}},
      cta{${ctaActionFields}},
      items[]{
        title,
        description,
        subtitle,
        value,
        label,
        quote,
        attribution,
        "image": image{ crop, hotspot, asset },
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
      "programCta": cta{${ctaActionFields}},
      "programItems": items[]{
        title,
        description,
        "image": image{ crop, hotspot, asset },
        "imageSrc": image.asset->url,
        imageAlt,
        href,
        hoverColor,
        "cardCta": cardCta{${ctaActionFields}}
      },
      "impactMetrics": metrics[]{ value, label, href },
      "testimonialItems": items[]{ quote, attribution },
      "highlightItems": items[]{ text },
      carouselSettings{
        transition,
        transitionDurationMs,
        autoPlayMs,
        showPagination,
        showProgress
      },
      "cardItems": items[]{
        title,
        description,
        detail,
        "image": image{ crop, hotspot, asset },
        "imageSrc": image.asset->url,
        imageAlt,
        hoverColor,
        href,
        "cardCta": cardCta{${ctaActionFields}}
      },
      "collectionArticleItems": items[]{
        heading,
        summary,
        subtitle,
        description,
        "image": image{ crop, hotspot, asset },
        "imageSrc": image.asset->url,
        imageAlt,
        href,
        "cardCta": cardCta{${ctaActionFields}}
      },
      "imageItems": items[]{
        title,
        subtitle,
        "image": image{ crop, hotspot, asset },
        "imageSrc": image.asset->url,
        imageAlt,
        "cardCta": cardCta{${ctaActionFields}}
      },
      "textCta": cta{${ctaFields}},
      "ctaButton": cta{${ctaFields}}
    }
  }
`;

/** Paths for published `page` documents (used by sitemap). */
export const publishedPagePathsQuery = groq`
  *[_type == "page" && defined(path) && path != ""].path
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
      phone,
      siteLinks[]{ label, href },
      socialLinks[]{ label, href },
      partnersTitle,
      newsletterSignup{
        title,
        description,
        buttonLabel,
        legalText,
        "image": image{ crop, hotspot, asset },
        "imageSrc": image.asset->url,
        imageAlt
      },
      partners[]{
        name,
        "logo": logo{ crop, hotspot, asset },
        "logoSrc": logo.asset->url,
        logoAlt,
        tagline
      },
      sponsorCarousel{
        transition,
        transitionDurationMs,
        autoPlayMs,
        showPagination,
        showProgress
      },
      servingLine
    }
  }
`;
