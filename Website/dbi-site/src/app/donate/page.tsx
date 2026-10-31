import { notFound, redirect } from "next/navigation";
import { resolveCampaignUrls, resolveDonateHref } from "@/lib/donate-url";
import { buildGivingOptions } from "@/lib/giving-options";
import { createMetadataForPath } from "@/lib/page-metadata";
import { Container } from "@/components/Container";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { GivingOptions } from "@/components/GivingOptions";
import { Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export const generateMetadata = createMetadataForPath("/donate");

export default async function DonatePage() {
  const campaignUrls = resolveCampaignUrls();

  if (campaignUrls) {
    return (
      <ContentPageLayout
        title="Choose how to give"
        lead="Help African American students in Contra Costa County get ready for what's next."
      >
        <Section noPadding>
          <Container maxWidth="narrow" className="pb-16 md:pb-20">
            <GivingOptions options={buildGivingOptions(campaignUrls)} />
          </Container>
        </Section>
      </ContentPageLayout>
    );
  }

  const [cmsPage, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: "/donate" }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);

  const donateUrl = resolveDonateHref(siteSettings?.donateUrl);

  if (donateUrl !== "/donate") {
    redirect(donateUrl);
  }

  if (!cmsPage?.content?.length) {
    notFound();
  }

  if (cmsPage.layout === "site") {
    return (
      <SiteLayout>
        <PageContentRenderer content={cmsPage.content} donateUrl={donateUrl} />
      </SiteLayout>
    );
  }

  return (
    <ContentPageLayout title={cmsPage.title} lead={cmsPage.lead} description={cmsPage.description}>
      <PageContentRenderer content={cmsPage.content} donateUrl={donateUrl} />
    </ContentPageLayout>
  );
}
