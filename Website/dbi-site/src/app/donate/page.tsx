import { notFound, redirect } from "next/navigation";
import { resolveDonateHref } from "@/lib/donate-url";
import { createMetadataForPath } from "@/lib/page-metadata";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export const generateMetadata = createMetadataForPath("/donate");

export default async function DonatePage() {
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
