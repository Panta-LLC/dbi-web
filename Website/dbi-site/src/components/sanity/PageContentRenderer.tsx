import { Fragment, type ReactNode } from "react";
import { renderPageContentBlock } from "./pageContent/renderPageContentBlock";
import type { ContentBlock } from "./pageContent/pageContentTypes";

export { PAGE_CONTENT_BLOCK_TYPES, type PageContentBlockType } from "./pageContent/blockRegistry";

type PageContentRendererProps = {
  content?: ContentBlock[];
  donateUrl?: string | null;
  /** Rendered between the first block (usually the hero) and the rest. */
  afterFirstBlock?: ReactNode;
};

export function PageContentRenderer({ content, donateUrl, afterFirstBlock }: PageContentRendererProps) {
  if (!content?.length) return null;

  return (
    <>
      {content.map((block, index) => (
        <Fragment key={block._key ?? index}>
          {renderPageContentBlock(block, index, donateUrl)}
          {index === 0 ? afterFirstBlock : null}
        </Fragment>
      ))}
    </>
  );
}
