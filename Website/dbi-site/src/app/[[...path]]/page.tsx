import { redirect, notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery } from "@/sanity/queries";

function normalizePath(segments?: string[]) {
  if (!segments || segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

export default async function CmsCatchAllPage({
  params,
}: {
  params: { path?: string[] };
}) {
  const requestedPath = normalizePath(params.path);

  let cmsPage = await sanityClient
    .fetch(pageByPathQuery, { path: requestedPath })
    .catch(() => null);

  if (!cmsPage?.content?.length) {
    // Transitional support: old `/programs` links should work even if Sanity is migrated.
    if (requestedPath === "/programs") {
      const servicesPage = await sanityClient
        .fetch(pageByPathQuery, { path: "/services" })
        .catch(() => null);

      if (servicesPage?.content?.length) {
        redirect("/services");
      }
    }

    notFound();
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

