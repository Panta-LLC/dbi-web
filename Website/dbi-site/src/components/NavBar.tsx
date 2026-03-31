"use client";

import NextLink from "next/link";
import { useState } from "react";
import { Button } from "./Button";
import { Container } from "./Container";
import { Link } from "./Link";

const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_DONATE_HREF = process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

type NavBarProps = {
  donateUrl?: string | null;
};

export function NavBar({ donateUrl }: NavBarProps) {
  const donateHref = donateUrl || DEFAULT_DONATE_HREF;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="nav-entrance nav-solid fixed max-w-7xl mx-auto inset-x-0 top-0 z-[100] font-inter text-slate-900 transition-colors duration-300 border-b-4 md:border-b-5 border-orange-400">
        {/* <Container className="flex items-center justify-start gap-3 lg:gap-6"> */}
        <div className="flex items-center justify-start max-w-5xl mx-auto">
          <div className="flex grow items-center justify-start gap-3 lg:gap-6">
            <NextLink href="/" className="flex items-center" aria-label="Delta Bay Impact Home">
              <div className="nav-logo-badge py-2">
                <img
                  src="/dbi_logo.png"
                  alt="Delta Bay Impact Logo"
                  className="h-12 sm:h-16 w-auto"
                  style={{ display: "block" }}
                />
              </div>
            </NextLink>
            <nav className="hidden gap-2 text-sm tracking-[0.12em] lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} variant="nav">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="absolute flex pr-2 items-center ml-auto my-auto text-right right-0 top-auto bottom-auto">
            <Button href={donateHref} variant="nav-primary" className="m-2">
              <h5 className="text-lg text-white">Donate</h5>
            </Button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
              className="flex h-9 w-9 lg:h-11 lg:w-11 items-center justify-center text-primary transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6 lg:h-6 lg:w-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  /* X icon */
                  <>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </>
                ) : (
                  /* Hamburger icon */
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* </Container> */}
      </header>

      {/* Mobile menu overlay - blurs content but stays below navbar */}
      <div
        className={`mobile-menu-overlay fixed inset-0 top-[56px] lg:top-[88px] z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      {/* Mobile menu drawer - slides out below navbar */}
      <aside
        className={`mobile-menu-drawer fixed right-0 top-[56px] lg:top-[88px] z-[110] h-[calc(100vh-56px)] lg:h-[calc(100vh-88px)] w-72 max-w-full bg-white shadow-lg transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-4 px-6 py-6 text-sm uppercase tracking-[0.12em] text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} variant="nav" onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <Link href={donateHref} variant="nav" onClick={closeMenu}>
            Donate
          </Link>
        </nav>
      </aside>
    </>
  );
}
