import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="py-10">
        <div className="flex items-center justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
            Footer
          </p>
        </div>
      </Container>
    </footer>
  );
}
