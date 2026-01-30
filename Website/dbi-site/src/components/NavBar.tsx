"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./Button";
import { Container } from "./Container";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="nav-entrance nav-solid fixed inset-x-0 top-0 z-50 border-orange-400 border-b-5 font-inter font-bold text-slate-900 transition-colors duration-300">
      <Container className="flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label="Delta Bay Impact Home">
          <div className="nav-logo-badge slant-clip-tight px-5 py-2">
            <img
              src="/dbi_logo.png"
              alt="Delta Bay Impact Logo"
              className="h-16 w-auto"
              style={{ display: "block" }}
            />
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-md font-bold uppercase tracking-[0.12em] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div>
          <Button href="/donate" variant="tertiary" className="py-8 px-4 bg-orange-400 text-white">
            <h5 className="text-md font-bold uppercase tracking-[0.12em] text-white">Donate</h5>
          </Button>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </Container>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ease-out ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 max-w-full bg-white shadow-lg transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="text-sm font-semibold text-slate-600"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-6 py-6 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <Link href="/donate" onClick={closeMenu}>
            Donate
          </Link>
        </nav>
      </aside>
    </header>
  );
}
