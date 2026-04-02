import { notFound, redirect } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export default async function ProgramsPage() {
  const [cmsPageResult, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: "/programs" }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);
  const cmsPage = cmsPageResult;
  if (!cmsPage?.content?.length) {
    const servicesPage = await sanityClient.fetch(pageByPathQuery, { path: "/services" }).catch(() => null);
    if (servicesPage?.content?.length) {
      redirect("/services");
    }
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
