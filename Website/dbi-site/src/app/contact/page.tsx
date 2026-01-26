import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { contactPageQuery } from "@/sanity/queries";

export default async function ContactPage() {
  const data = await sanityClient.fetch(contactPageQuery);

  if (!data) {
    return null;
  }

  return (
    <SiteLayout>
      <PageHeader
        title={data.pageHeader?.title}
        subtitle={data.pageHeader?.subtitle}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow={data.contactHeading?.eyebrow}
              title={data.contactHeading?.title}
              description={data.contactHeading?.description}
            />
            <form className="mt-8 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                  placeholder={data.contactForm?.firstNamePlaceholder}
                />
                <input
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                  placeholder={data.contactForm?.lastNamePlaceholder}
                />
              </div>
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                placeholder={data.contactForm?.emailPlaceholder}
              />
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                placeholder={data.contactForm?.organizationPlaceholder}
              />
              <textarea
                className="min-h-[140px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                placeholder={data.contactForm?.messagePlaceholder}
              />
              <div>
                <Button>{data.contactForm?.submitLabel}</Button>
              </div>
            </form>
          </div>
          <div className="rounded-3xl border border-border bg-muted p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {data.contactDetails?.eyebrow}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Email: {data.contactDetails?.email}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Phone: {data.contactDetails?.phone}
            </p>
            <p className="mt-6 text-sm text-slate-600">
              {data.contactDetails?.responseNote}
            </p>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
}
