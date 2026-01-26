import Link from "next/link";
import { Button } from "./Button";
import { Container } from "./Container";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Resources", href: "/resources" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              Delta Bay Impact
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Educate - Advocate - Elevate
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href="/contact" variant="secondary">
            Contact Us
          </Button>
        </div>
        <p className="mt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Delta Bay Impact. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
