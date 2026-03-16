import type { ReactElement } from "react";
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { sanityClient } from "@/sanity/client";
import { footerQuery } from "@/sanity/queries";
import { Container } from "./Container";
import { EmailActions } from "./EmailActions";
import { Section } from "./Section";
import { SponsorSection } from "./SponsorSection";
import { Link } from "./Link";

type LinkItem = { label: string; href: string };
type IconComponent = () => ReactElement;

const defaultContent = {
  heading: "Delta Bay Impact",
  description:
    "Building opportunity through community partnerships, programs, and impact-driven work.",
  email: "info@deltabayimpact.org",
  partnersTitle: "Our Sponsors",
  partners: [
    { name: "Community Health Fund", tagline: "John Muir Health · Building Bridges to Better Health" },
    { name: "Keller Canyon Mitigation Fund" },
    { name: "Antioch Community Foundation" },
  ],
  siteLinks: [
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
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
  instagram: () => <FaInstagram className="h-7 w-7" />,
  facebook: () => <FaFacebookF className="h-7 w-7" />,
  linkedin: () => <FaLinkedinIn className="h-7 w-7" />,
};

const isExternalLink = (href: string) => href.startsWith("http");

export async function Footer() {
  const data = (await sanityClient.fetch(footerQuery).catch(() => null)) ?? defaultContent;
  const content = {
    ...defaultContent,
    ...data,
    partners: (data.partners?.length ? data.partners : defaultContent.partners) as {
      name: string;
      logoSrc?: string;
      logoAlt?: string;
      tagline?: string;
    }[],
    siteLinks: (data.siteLinks?.length ? data.siteLinks : defaultContent.siteLinks) as LinkItem[],
    socialLinks: (data.socialLinks?.length
      ? data.socialLinks
      : defaultContent.socialLinks) as LinkItem[],
  };

  return (
    <>
      {content.partners.length ? (
        <SponsorSection
          titleLine1="Special Thanks to"
          titleLine2={content.partnersTitle ?? "Our Sponsors"}
          items={content.partners.map((p: { name: string; logoSrc?: string; logoAlt?: string; tagline?: string }) => ({
            name: p.name,
            logoSrc: p.logoSrc,
            logoAlt: p.logoAlt,
            tagline: p.tagline,
          }))}
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
            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-5 content-end">
              <div className="flex flex-wrap gap-x-3 gap-y-2 md:gap-x-4 text-slate-700 border-b-2 border-slate-200 pb-4">
                {content.siteLinks.map((link: LinkItem) => (
                  <div key={link.href} className="inline-block">
                    <Link
                      href={link.href}
                      variant="nav"
                      className="touch-target text-sm md:text-base font-semibold"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <EmailActions email={content.email} />
                <div className="space-y-3">
                  <ul className="flex items-center">
                    {content.socialLinks.map((link: LinkItem) => {
                      const Icon =
                        SOCIAL_ICONS[link.label.toLowerCase()] ??
                        (() => <FaInstagram className="h-5 w-5 md:h-6 md:w-6" />);
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="touch-target inline-flex items-center justify-center transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:text-primary focus:text-primary focus:ring-2 focus:ring-primary rounded"
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
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-10 border-t border-slate-200 pt-5 md:pt-6">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              © {new Date().getFullYear()} Delta Bay Impact | Nonprofit youth organization
            </p>
            <p className="mt-1 text-xs md:text-sm text-slate-600 leading-relaxed">
              Serving Bay Point, Concord, and Pittsburg schools since 2023
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
}
