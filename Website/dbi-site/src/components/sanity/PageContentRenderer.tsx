import { renderPageContentBlock } from "./pageContent/renderPageContentBlock";
import type { ContentBlock } from "./pageContent/pageContentTypes";

export { PAGE_CONTENT_BLOCK_TYPES, type PageContentBlockType } from "./pageContent/blockRegistry";

type PageContentRendererProps = {
  content?: ContentBlock[];
  donateUrl?: string | null;
};

export function PageContentRenderer({ content, donateUrl }: PageContentRendererProps) {
  if (!content?.length) return null;

  return <>{content.map((block, index) => renderPageContentBlock(block, index, donateUrl))}</>;
}
