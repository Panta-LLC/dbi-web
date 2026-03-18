import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col text-foreground mx-auto max-w-7xl bg-white">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <NavBar />
      <main id="main-content" className="flex-1 pt-[80px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
