import type { ReactNode } from "react";
import { ContactBand } from "./ContactBand";
import { PageIntro } from "./PageIntro";
import { SiteLayout } from "./SiteLayout";
import { Section } from "./Section";
import { Container } from "./Container";

type ContentPageLayoutProps = {
  title: string;
  lead: string;
  description?: string;
  children: ReactNode;
};

export function ContentPageLayout({ title, lead, description, children }: ContentPageLayoutProps) {
  return (
    <SiteLayout>
      <Section>
        <div className="pt-12">
          <PageIntro title={title} lead={lead} description={description} />
        </div>
      </Section>
      {children}
      <ContactBand className="bg-primary" />
    </SiteLayout>
  );
}
