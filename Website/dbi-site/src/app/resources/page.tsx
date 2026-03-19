import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery } from "@/sanity/queries";

export default async function ResourcesPage() {
  const cmsPage = await sanityClient.fetch(pageByPathQuery, { path: "/resources" }).catch(() => null);
  if (!cmsPage?.content?.length) {
    return null;
  }

  if (cmsPage.layout === "site") {
    return (
      <SiteLayout>
        <PageContentRenderer content={cmsPage.content} />
      </SiteLayout>
    );
  }

  return (
    <ContentPageLayout title={cmsPage.title} lead={cmsPage.lead} description={cmsPage.description}>
      <PageContentRenderer content={cmsPage.content} />
    </ContentPageLayout>
  );
}
