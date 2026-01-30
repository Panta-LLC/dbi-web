import Link from "next/link";
import type { ReactElement } from "react";
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { sanityClient } from "@/sanity/client";
import { footerQuery } from "@/sanity/queries";
import { Container } from "./Container";
import { EmailActions } from "./EmailActions";
import { LogoGrid } from "./LogoGrid";
import { Section } from "./Section";

type LinkItem = { label: string; href: string };
type IconComponent = () => ReactElement;

const defaultContent = {
  heading: "Delta Bay Impact",
  description:
    "Building opportunity through community partnerships, programs, and impact-driven work.",
  email: "info@deltabayimpact.org",
  partnersTitle: "Our Partners",
  partners: [
    { name: "Community Health Fund" },
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
    }[],
    siteLinks: (data.siteLinks?.length ? data.siteLinks : defaultContent.siteLinks) as LinkItem[],
    socialLinks: (data.socialLinks?.length
      ? data.socialLinks
      : defaultContent.socialLinks) as LinkItem[],
  };

  return (
    <>
      <Section className="bg-slate-100">
        <Container>
          {content.partners.length ? (
            <div>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xs">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {content.partnersTitle}
                  </p>
                  <p className="heading-4">
                    Thank you to our sponsors for supporting our community work.
                  </p>
                </div>
                <div className="w-full lg:max-w-4xl">
                  <LogoGrid items={content.partners} />
                </div>
              </div>
            </div>
          ) : null}
        </Container>
      </Section>
      <footer className="bg-white border-t-5 border-orange-400">
        <Container className="py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="col-span-1 space-y-4">
              <div className="flex items-center ">
                <img
                  src="/dbi_logo.png"
                  alt="Delta Bay Impact Logo"
                  className="h-16 w-auto"
                  style={{ maxWidth: "160px" }}
                />
              </div>
              <p className="display-s">{content.description}</p>
            </div>
            <div className="col-span-2 space-y-4 content-end">
              <div className="gap-2 text-slate-700 border-b-2 border-slate-200 pb-4">
                {content.siteLinks.map((link: LinkItem) => (
                  <div key={link.href} className="inline-block">
                    {isExternalLink(link.href) ? (
                      <a href={link.href} className="heading-3 transition hover:text-primary">
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm heading-3 transition hover:text-primary mr-4"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <EmailActions email={content.email} />
                <div className="space-y-3">
                  <ul className="flex items-center gap-3">
                    {content.socialLinks.map((link: LinkItem) => {
                      const Icon =
                        SOCIAL_ICONS[link.label.toLowerCase()] ??
                        (() => <FaInstagram className="h-7 w-7" />);
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="inline-flex items-center justify-center  transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:text-primary"
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
          <div className="mt-10 pt-6">© {new Date().getFullYear()} Delta Bay Impact</div>
        </Container>
      </footer>
    </>
  );
}
