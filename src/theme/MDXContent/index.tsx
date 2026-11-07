import type {ReactNode} from 'react';
import OriginalContent from '@theme-original/MDXContent';
import type {Props} from '@theme/MDXContent';
import SeriesNav from '../../components/ReadingUI/SeriesNav';

export default function MDXContent(props: Props): ReactNode {
  return <><div data-reading-body><OriginalContent {...props} /></div><SeriesNav /></>;
}
