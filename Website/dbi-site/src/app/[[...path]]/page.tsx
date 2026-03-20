import { redirect, notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery, siteSettingsQuery } from "@/sanity/queries";

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

    // Home page: show debug fallback when content is missing
    if (requestedPath === "/") {
      return (
        <SiteLayout>
          <div className="p-8">
            <h1 className="text-xl font-semibold text-slate-900">Home page content not found</h1>
            <p className="mt-2 text-sm text-slate-600">
              No `page` document with usable `content[]` was resolved for path <code>/</code>.
            </p>
            <pre className="mt-4 max-w-full overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
              {JSON.stringify(cmsPage, null, 2)}
            </pre>
          </div>
        </SiteLayout>
      );
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

