import { notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { resolveDonateHref } from "@/lib/donate-url";
import { createMetadataForPath } from "@/lib/page-metadata";
import { sanityClient } from "@/sanity/client";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export const generateMetadata = createMetadataForPath("/about");

export default async function AboutPage() {
  const [cmsPage, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: "/about" }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);
  if (!cmsPage?.content?.length) {
    notFound();
  }
  const donateUrl = resolveDonateHref(siteSettings?.donateUrl);

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
