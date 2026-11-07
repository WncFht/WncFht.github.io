import type {ReactNode} from 'react';
import {ReadingProgressProvider} from '../../components/ReadingProgress';
import BackToTop from '../../components/BackToTop';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return <ReadingProgressProvider>{children}<BackToTop /></ReadingProgressProvider>;
}
