import Link from "next/link";
import type { ReactElement } from "react";
import { sanityClient } from "@/sanity/client";
import { footerQuery } from "@/sanity/queries";
import { Container } from "./Container";
import { LogoGrid } from "./LogoGrid";

type LinkItem = { label: string; href: string };
type IconComponent = () => ReactElement;

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2 8 5 8-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      ry="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17" cy="7" r="1" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      d="M15 3h3v3h-3c-1.1 0-2 .9-2 2v3h5l-1 4h-4v6h-4v-6H6v-4h3V8a5 5 0 0 1 5-5z"
      fill="currentColor"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect x="7" y="9" width="2.5" height="8" fill="currentColor" />
    <circle cx="8.25" cy="7.5" r="1.2" fill="currentColor" />
    <path d="M12 9h2.2a3 3 0 0 1 3 3v5H15v-4.5a1.5 1.5 0 0 0-3 0V17H10v-8h2z" fill="currentColor" />
  </svg>
);

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
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
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
    <footer className="bg-white border-t-5 border-orange-400">
      <Container className="pb-12">
        {content.partners.length ? (
          <>
            <div className="my-4">
              <LogoGrid items={content.partners} />
            </div>
          </>
        ) : null}
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
            <div className="gap-2 text-sm text-slate-700 border-b-2 border-slate-200 pb-4">
              {content.siteLinks.map((link: LinkItem) => (
                <div key={link.href} className="inline-block">
                  {isExternalLink(link.href) ? (
                    <a href={link.href} className="heading-3 transition hover:text-primary">
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm heading-4 transition hover:text-primary mr-4"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <a
                  href={`mailto:${content.email}`}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-primary"
                >
                  <EmailIcon />
                  {content.email}
                </a>
              </div>
              <div className="space-y-3">
                <ul className="flex items-center gap-3 text-slate-700">
                  {content.socialLinks.map((link: LinkItem) => {
                    const Icon = SOCIAL_ICONS[link.label.toLowerCase()] ?? InstagramIcon;
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-slate-600 transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:text-primary"
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
  );
}
