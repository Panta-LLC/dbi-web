import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <SiteLayout>
      <Container className="py-20 md:py-28 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">404</p>
        <h1 className="display-m mt-2 text-slate-900">Page not found</h1>
        <p className="body-md mt-4 text-slate-600 max-w-md mx-auto">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex mt-8 text-primary font-semibold underline underline-offset-4 hover:opacity-90"
        >
          Back to home
        </Link>
      </Container>
    </SiteLayout>
  );
}
