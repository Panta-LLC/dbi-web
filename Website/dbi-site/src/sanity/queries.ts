import { groq } from "next-sanity";

const ctaFields = `
  label,
  href
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero{
      title,
      subtitle,
      primaryCta{${ctaFields}},
      secondaryCta{${ctaFields}},
      "imageSrc": image.asset->url,
      imageAlt
    },
    intro,
    serve{
      title,
      description,
      cta{${ctaFields}},
      items[]{ title, description }
    },
    latest{
      title,
      items[]{ title, date, description, "imageSrc": image.asset->url, imageAlt }
    },
    partners{
      title,
      items[]{
        name,
        "logoSrc": logo.asset->url,
        "logoAlt": logoAlt
      }
    },
    contact{
      title,
      description,
      cta{${ctaFields}}
    }
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    title,
    lead,
    description,
    values{
      title,
      items[]{ title, description }
    },
    story{
      title,
      description
    },
    leadership{
      title,
      members[]{ name, role }
    },
    partners{
      title,
      items[]{
        name,
        "logoSrc": logo.asset->url,
        "logoAlt": logoAlt
      }
    },
    support{
      title,
      description,
      primaryCta{${ctaFields}},
      secondaryCta{${ctaFields}}
    }
  }
`;

export const programsPageQuery = groq`
  *[_type == "programsPage"][0]{
    title,
    lead,
    description,
    programs{
      title,
      items[]{ title, description },
      cta{${ctaFields}}
    }
  }
`;

export const impactPageQuery = groq`
  *[_type == "impactPage"][0]{
    title,
    lead,
    outcomes{
      title,
      items
    },
    locations{
      title,
      items[]{ name, location }
    },
    learning{
      description,
      cta{${ctaFields}}
    }
  }
`;

export const getInvolvedPageQuery = groq`
  *[_type == "getInvolvedPage"][0]{
    title,
    lead,
    description,
    pathways{
      title,
      items,
      cta{${ctaFields}}
    }
  }
`;

export const resourcesPageQuery = groq`
  *[_type == "resourcesPage"][0]{
    title,
    lead,
    description,
    items{
      title,
      items
    }
  }
`;

export const donatePageQuery = groq`
  *[_type == "donatePage"][0]{
    title,
    lead,
    description,
    support{
      title,
      items,
      cta{${ctaFields}}
    }
  }
`;

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    pageHeader{
      title,
      subtitle
    },
    contactHeading{
      eyebrow,
      title,
      description
    },
    contactForm{
      firstNamePlaceholder,
      lastNamePlaceholder,
      emailPlaceholder,
      organizationPlaceholder,
      messagePlaceholder,
      submitLabel
    },
    contactDetails{
      eyebrow,
      email,
      phone,
      responseNote
    }
  }
`;

export const footerQuery = groq`
  *[_type == "footer"][0]{
    heading,
    description,
    email,
    siteLinks[]{ label, href },
    socialLinks[]{ label, href }
  }
`;
