import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-200 text-foreground">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <NavBar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
