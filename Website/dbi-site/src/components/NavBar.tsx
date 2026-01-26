import Image from "next/image";
import Link from "next/link";
import { AngledButton } from "./AngledButton";
import { Container } from "./Container";

const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
      <Container className="flex items-center justify-between gap-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/dbi_logo.png"
            alt="Delta Bay Impact"
            width={140}
            height={48}
          />
        </Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex">
          <AngledButton href="/donate">Donate</AngledButton>
        </div>
      </Container>
    </header>
  );
}
