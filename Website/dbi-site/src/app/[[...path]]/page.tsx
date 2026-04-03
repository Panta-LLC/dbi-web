import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { buildMetadataForPath, normalizePathSegments } from "@/lib/page-metadata";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path: segments } = await params;
  return buildMetadataForPath(normalizePathSegments(segments));
}

export default async function CmsCatchAllPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path: segments } = await params;
  const requestedPath = normalizePathSegments(segments);

  const [cmsPage, siteSettings] = await Promise.all([
    sanityClient.fetch(pageByPathQuery, { path: requestedPath }).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);
  const donateUrl = siteSettings?.donateUrl ?? null;

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

