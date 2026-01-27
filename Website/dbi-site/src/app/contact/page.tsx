import { Button } from "@/components/Button";
import { ContactBand } from "@/components/ContactBand";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { contactPage } from "@/data/siteContent";

export default function ContactPage() {
  return (
    <SiteLayout>
      <PageIntro
        title={contactPage.title}
        lead={contactPage.lead}
        description={contactPage.description}
      />

      <Section className="bg-white">
        <Container className="flex justify-center">
          <Button href={contactPage.cta.href}>{contactPage.cta.label}</Button>
        </Container>
      </Section>

      <ContactBand />
    </SiteLayout>
  );
}
