/**
 * Adapted from Docusaurus theme-classic (MIT).
 * Copyright (c) Facebook, Inc. and its affiliates.
 * See licenses/Docusaurus-MIT.txt.
 * Keep native heading filtering; React owns highlighting and progress updates.
 */
import type {ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useFilteredAndTreeifiedTOC} from '@docusaurus/theme-common/internal';
import TOCItemTree from '@theme/TOCItems/Tree';
import type {Props} from '@theme/TOCItems';

export default function TOCItems({
  toc,
  className = 'table-of-contents table-of-contents__left-border',
  linkClassName = 'table-of-contents__link',
  minHeadingLevel,
  maxHeadingLevel,
}: Props): ReactNode {
  const {tableOfContents} = useThemeConfig();
  const tree = useFilteredAndTreeifiedTOC({
    toc,
    minHeadingLevel: minHeadingLevel ?? tableOfContents.minHeadingLevel,
    maxHeadingLevel: maxHeadingLevel ?? tableOfContents.maxHeadingLevel,
  });
  return <TOCItemTree toc={tree} className={className} linkClassName={linkClassName} />;
}
