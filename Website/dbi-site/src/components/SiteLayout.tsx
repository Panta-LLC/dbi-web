import type { ReactNode } from "react";
import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

type SiteLayoutProps = {
  children: ReactNode;
};

export async function SiteLayout({ children }: SiteLayoutProps) {
  const siteSettings = await sanityClient.fetch(siteSettingsQuery).catch(() => null);
  const donateUrl = siteSettings?.donateUrl ?? null;

  return (
    <div className="flex min-h-screen flex-col text-foreground mx-auto max-w-7xl bg-white">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <NavBar donateUrl={donateUrl} />
      <main id="main-content" className="flex-1 pt-[68px] md:pt-[80px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
