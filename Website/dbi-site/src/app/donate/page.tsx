import { notFound, redirect } from "next/navigation";
import { resolveCampaignUrls, resolveDonateHref } from "@/lib/donate-url";
import { createMetadataForPath } from "@/lib/page-metadata";
import { CampaignPage } from "@/components/CampaignPage";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import type { ContentBlock } from "@/components/sanity/pageContent/pageContentTypes";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export const generateMetadata = createMetadataForPath("/donate");

export default async function DonatePage() {
  const [cmsPage, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: "/donate" }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);

  const donateUrl = resolveDonateHref(siteSettings?.donateUrl);
  const hasGivingOptions = cmsPage?.content?.some(
    (block: ContentBlock) =>
      block._type === "givingOptionsSection" && Boolean(block.givingOptions?.length),
  );

  if (hasGivingOptions) {
    return (
      <SiteLayout>
        <PageContentRenderer content={cmsPage.content} donateUrl={donateUrl} />
      </SiteLayout>
    );
  }

  const campaignUrls = resolveCampaignUrls();

  if (campaignUrls) {
    return (
      <SiteLayout>
        <CampaignPage {...campaignUrls} />
      </SiteLayout>
    );
  }

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
