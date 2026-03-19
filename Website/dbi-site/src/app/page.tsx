import { SiteLayout } from "@/components/SiteLayout";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { sanityClient } from "@/sanity/client";
import { pageByPathQuery } from "@/sanity/queries";

export default async function Home() {
  const cmsPage = await sanityClient.fetch(pageByPathQuery, { path: "/" }).catch(() => null);
  const hasContent = Array.isArray(cmsPage?.content) && cmsPage.content.length > 0;

  return (
    <SiteLayout>
      {hasContent ? (
        <PageContentRenderer content={cmsPage!.content} />
      ) : (
        <div className="p-8">
          <h1 className="text-xl font-semibold text-slate-900">Home page content not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            No `page` document with usable `content[]` was resolved for path <code>/</code>.
          </p>
          <pre className="mt-4 max-w-full overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
            {JSON.stringify(cmsPage, null, 2)}
          </pre>
        </div>
      )}
    </SiteLayout>
  );
}
