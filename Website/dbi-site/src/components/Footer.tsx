import type { ReactElement } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { urlForSanityImage } from "@/lib/sanity-image";
import { sanityClient } from "@/sanity/client";
import { siteQuery } from "@/sanity/queries";
import type { SanityImageSource } from "@sanity/image-url";
import { Container } from "./Container";
import { EmailActions } from "./EmailActions";
import { PhoneActions } from "./PhoneActions";
import { NewsletterSignup } from "./NewsletterSignup";
import { SponsorSection } from "./SponsorSection";
import { Link } from "./Link";

type LinkItem = { label: string; href: string };
type IconComponent = () => ReactElement;

const defaultContent = {
  heading: "Delta Bay Impact",
  description:
    "Building opportunity through community partnerships, programs, and impact-driven work.",
  email: "info@deltabayimpact.org",
  phone: "",
  partnersTitle: "Our Sponsors",
  partners: [
    {
      name: "Community Health Fund",
      tagline: "John Muir Health · Building Bridges to Better Health",
    },
    { name: "Keller Canyon Mitigation Fund" },
    { name: "Antioch Community Foundation" },
  ],
  newsletterSignup: {
    title: "Keep up with our Work!",
    description: "Subscribe to our newsletter and receive periodic updates from Delta Bay Impact.",
    buttonLabel: "Sign up for our Newsletter",
    legalText:
      "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
    imageAlt: "Community",
  },
  servingLine: "Serving Bay Point, Concord, and Pittsburg schools since 2023",
  siteLinks: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Impact", href: "/impact" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
    { label: "Donate", href: "/donate" },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

const SOCIAL_ICONS: Record<string, IconComponent> = {
  instagram: () => <Instagram className="h-5 w-5 shrink-0" />,
  facebook: () => <Facebook className="h-5 w-5 shrink-0" />,
  linkedin: () => <Linkedin className="h-5 w-5 shrink-0" />,
};

export async function Footer() {
  const siteData = await sanityClient.fetch(siteQuery).catch(() => null);
  const data = siteData?.footer ?? defaultContent;
  const donateUrl = siteData?.donateUrl ?? null;
  const rawSiteLinks = (
    data.siteLinks?.length ? data.siteLinks : defaultContent.siteLinks
  ) as LinkItem[];
  const siteLinks = rawSiteLinks.map((link) =>
    link.label === "Donate" && donateUrl ? { ...link, href: donateUrl } : link,
  );
  const rawPartners = (data.partners?.length ? data.partners : defaultContent.partners) as {
    name: string;
    logo?: SanityImageSource;
    logoSrc?: string;
    logoAlt?: string;
    tagline?: string;
  }[];

  const content = {
    ...defaultContent,
    ...data,
    partners: rawPartners.map((p) => ({
      ...p,
      logoSrc: urlForSanityImage(p.logo) ?? p.logoSrc,
    })),
    siteLinks,
    socialLinks: (data.socialLinks?.length
      ? data.socialLinks
      : defaultContent.socialLinks) as LinkItem[],
  };

  return (
    <>
      <NewsletterSignup
        title={content.newsletterSignup?.title}
        description={content.newsletterSignup?.description}
        buttonLabel={content.newsletterSignup?.buttonLabel}
        legalText={content.newsletterSignup?.legalText}
        imageSrc={
          urlForSanityImage(
            (content.newsletterSignup as { image?: SanityImageSource } | undefined)?.image,
          ) ?? content.newsletterSignup?.imageSrc
        }
        imageAlt={content.newsletterSignup?.imageAlt}
      />
      {content.partners.length ? (
        <SponsorSection
          titleLine1="Special Thanks to"
          titleLine2={content.partnersTitle ?? "Our Sponsors"}
          carousel={content.sponsorCarousel}
          items={content.partners.map(
            (p: { name: string; logoSrc?: string; logoAlt?: string; tagline?: string }) => ({
              name: p.name,
              logoSrc: p.logoSrc,
              logoAlt: p.logoAlt,
              tagline: p.tagline,
            }),
          )}
        />
      ) : null}
      <footer className="bg-white border-t-4 md:border-t-5 border-orange-400">
        <Container className="py-8 md:py-10 lg:py-12">
          <div className="grid gap-8 md:gap-10 md:grid-cols-3">
            <div className="col-span-1 space-y-3 md:space-y-4">
              <div className="flex items-center">
                <img
                  src="/dbi_logo.png"
                  alt="Delta Bay Impact Logo"
                  className="h-14 md:h-16 w-auto"
                  style={{ maxWidth: "160px" }}
                />
              </div>
              <p className="display-s text-balance">{content.description}</p>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-5 content-start">
              <div className="flex flex-wrap gap-x-3 gap-y-2 md:gap-x-4 text-slate-700 border-b-2 border-slate-200 pb-4 flex-col md:flex-row">
                {content.siteLinks.map((link: LinkItem) => (
                  <div key={link.href} className="inline-block">
                    <Link
                      href={link.href}
                      variant="nav"
                      className="touch-target text-md md:text-sm font-semibold"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-slate-700">
                <EmailActions email={content.email} />
                {content.phone?.trim() ? (
                  <>
                    <span className="text-slate-400 select-none shrink-0" aria-hidden>
                      |
                    </span>
                    <PhoneActions phone={content.phone.trim()} />
                  </>
                ) : null}
                {content.socialLinks.length > 0 ? (
                  <>
                    <span className="text-slate-400 select-none shrink-0" aria-hidden>
                      |
                    </span>
                    <ul className="flex items-center gap-1">
                      {content.socialLinks.map((link: LinkItem) => {
                        const Icon =
                          SOCIAL_ICONS[link.label.toLowerCase()] ??
                          (() => <Instagram className="h-5 w-5 shrink-0" />);
                        return (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              className="touch-target inline-flex items-center justify-center transition hover:text-primary focus:text-primary focus:ring-2 focus:ring-primary rounded"
                              target="_blank"
                              rel="noreferrer"
                              aria-label={link.label}
                            >
                              <Icon />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-10 border-t border-slate-200 pt-5 md:pt-6">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              © {new Date().getFullYear()} Delta Bay Impact | Nonprofit youth organization
            </p>
            {content.servingLine ? (
              <p className="mt-1 text-xs md:text-sm text-slate-600 leading-relaxed">
                {content.servingLine}
              </p>
            ) : null}
          </div>
        </Container>
      </footer>
    </>
  );
}
