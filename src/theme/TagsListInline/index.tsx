import type {ReactNode} from 'react';
import OriginalTagsListInline from '@theme-original/TagsListInline';
import type {Props} from '@theme/TagsListInline';
import {contentFeatures} from '../../config/content';

export default function TagsListInline(props: Props): ReactNode {
  return contentFeatures.tags ? <OriginalTagsListInline {...props} /> : null;
}
