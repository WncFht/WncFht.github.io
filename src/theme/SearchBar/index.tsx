import type {ReactNode} from 'react';
import OriginalSearchBar from '@theme-original/SearchBar';

// Retain easyops' index, keyboard handling, result templates and ARIA behavior.
export default function SearchBar(): ReactNode {
  return <div className="reading-search"><OriginalSearchBar /></div>;
}
