import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground pt-3">
      <NavBar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
