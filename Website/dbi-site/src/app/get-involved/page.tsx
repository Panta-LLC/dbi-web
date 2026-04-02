import { notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export default async function GetInvolvedPage() {
  const [cmsPage, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: "/get-involved" }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);
  if (!cmsPage?.content?.length) {
    notFound();
  }
  const donateUrl = siteSettings?.donateUrl ?? null;

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
