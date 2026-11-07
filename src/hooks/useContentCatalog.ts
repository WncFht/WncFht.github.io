import {usePluginData} from '@docusaurus/useGlobalData';
import type {ContentCatalog} from '../types/content';

export default function useContentCatalog(): ContentCatalog {
  return usePluginData('content-catalog') as ContentCatalog;
}
