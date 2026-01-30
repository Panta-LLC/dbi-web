import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { Section } from "@/components/Section";
import { contactPage } from "@/data/siteContent";

export default function ContactPage() {
  return (
    <ContentPageLayout
      title={contactPage.title}
      lead={contactPage.lead}
      description={contactPage.description}
    >
      <Section className="bg-white">
        <Container className="flex justify-center">
          <Button href={contactPage.cta.href}>{contactPage.cta.label}</Button>
        </Container>
      </Section>
    </ContentPageLayout>
  );
}
