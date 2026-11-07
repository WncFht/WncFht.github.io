// Adapted from Axi404/Axi-Theme PublicationCard.astro. See THIRD_PARTY_NOTICES.md.
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export interface Publication {
  id: string;
  title: string;
  url: string;
  authors: ReactNode;
  venue: string;
  role?: string;
  abstract?: string;
  links?: readonly {label: string; href: string}[];
}

export default function PublicationCard({publication, headingLevel = 'h3'}: {
  publication: Publication;
  headingLevel?: 'h2' | 'h3' | 'h4';
}): ReactNode {
  return (
    <article className={styles.card}>
      <div className={styles.badges}>
        <span>{publication.venue}</span>
        {publication.role && <span>{publication.role}</span>}
      </div>
      <Heading as={headingLevel} className={styles.title}><Link to={publication.url}>{publication.title}</Link></Heading>
      <p className={styles.authors}>{publication.authors}</p>
      {publication.abstract && <p className={styles.abstract}>{publication.abstract}</p>}
      <ul className={styles.links} aria-label="论文资源">
        <li><Link to={publication.url}>Paper <span aria-hidden="true">↗</span></Link></li>
        {publication.links?.map((link) => <li key={link.href}><Link to={link.href}>{link.label} <span aria-hidden="true">↗</span></Link></li>)}
      </ul>
    </article>
  );
}
