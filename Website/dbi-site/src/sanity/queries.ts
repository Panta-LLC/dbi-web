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
      "imageAlt": imageAlt
    },
    whatWeDoHeading{
      eyebrow,
      title,
      description
    },
    whatWeDoItems[]{ title, description },
    impactHeading{
      eyebrow,
      title,
      description
    },
    impactCards[]{ value, label },
    sponsorsHeading{
      eyebrow,
      title,
      description
    },
    sponsors
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    pageHeader{
      title,
      subtitle
    },
    storyHeading{
      eyebrow,
      title,
      description
    },
    missionPillars[]{ eyebrow, title, description },
    valuesHeading{
      eyebrow,
      title,
      description
    },
    values[]{ eyebrow, title, description },
    cta{
      title,
      description,
      primaryCta{${ctaFields}}
    }
  }
`;

export const programsPageQuery = groq`
  *[_type == "programsPage"][0]{
    pageHeader{
      title,
      subtitle
    },
    programsHeading{
      eyebrow,
      title,
      description
    },
    programs[]{ eyebrow, title, description },
    accessHeading{
      eyebrow,
      title,
      description
    },
    cta{
      title,
      description,
      primaryCta{${ctaFields}}
    }
  }
`;

export const impactPageQuery = groq`
  *[_type == "impactPage"][0]{
    pageHeader{
      title,
      subtitle
    },
    highlightsHeading{
      eyebrow,
      title,
      description
    },
    impactHighlights[]{ eyebrow, title, description },
    outcomesHeading{
      eyebrow,
      title,
      description
    },
    outcomes[]{ eyebrow, title, description },
    cta{
      title,
      description,
      primaryCta{${ctaFields}}
    }
  }
`;

export const getInvolvedPageQuery = groq`
  *[_type == "getInvolvedPage"][0]{
    pageHeader{
      title,
      subtitle
    },
    pathwaysHeading{
      eyebrow,
      title,
      description
    },
    options[]{ eyebrow, title, description },
    cta{
      title,
      description,
      primaryCta{${ctaFields}}
    }
  }
`;

export const resourcesPageQuery = groq`
  *[_type == "resourcesPage"][0]{
    pageHeader{
      title,
      subtitle
    },
    resourcesHeading{
      eyebrow,
      title,
      description
    },
    resources[]{ eyebrow, title, description },
    cta{
      title,
      description,
      primaryCta{${ctaFields}}
    }
  }
`;

export const donatePageQuery = groq`
  *[_type == "donatePage"][0]{
    pageHeader{
      title,
      subtitle
    },
    supportHeading{
      eyebrow,
      title,
      description
    },
    supportOptions[]{ eyebrow, title, description },
    cta{
      title,
      description,
      primaryCta{${ctaFields}}
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
