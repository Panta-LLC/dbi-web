"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "./Container";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
          DBI
        </Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-slate-700 transition hover:bg-slate-50 lg:hidden"
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
        </nav>
      </aside>
    </header>
  );
}
