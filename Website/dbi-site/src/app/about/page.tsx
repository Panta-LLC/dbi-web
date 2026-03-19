import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { ContentPageLayout } from "@/components/ContentPageLayout";
import { ImageCard } from "@/components/ImageCard";
import { Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { sanityClient } from "@/sanity/client";
import { PageContentRenderer } from "@/components/sanity/PageContentRenderer";
import { pageByPathQuery } from "@/sanity/queries";

export default async function AboutPage() {
  const cmsPage = await sanityClient.fetch(pageByPathQuery, { path: "/about" }).catch(() => null);
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
