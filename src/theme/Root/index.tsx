import type {ReactNode} from 'react';
import {ReadingProgressProvider} from '../../components/ReadingProgress';
import BackToTop from '../../components/BackToTop';
import ReaderControls, {PreferencesProvider} from '../../components/ReadingUI/Preferences';
import ImageViewer from '../../components/ReadingUI/ImageViewer';
import ParagraphShare from '../../components/ReadingUI/ParagraphShare';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return <PreferencesProvider><ReadingProgressProvider>{children}<ImageViewer /><ParagraphShare /><ReaderControls /><BackToTop /></ReadingProgressProvider></PreferencesProvider>;
}
