import { notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export default async function ServicesPage() {
  const [servicesPage, programsPage, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: "/services" }).catch(() => null),
    sanityClient.fetch(pageByPathQuery, { path: "/programs" }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);
  const cmsPage = servicesPage?.content?.length ? servicesPage : programsPage;
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

