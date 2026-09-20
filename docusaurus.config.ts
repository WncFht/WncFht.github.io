import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Haotian Fang',
  tagline: 'Undergraduate @ UM-SJTU Joint Institute · LLM training & embodied AI',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://wncfht.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,

  // GitHub pages deployment config.
  organizationName: 'WncFht',
  projectName: 'WncFht.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          showReadingTime: true,
          postsPerPage: 10,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Haotian Fang',
      items: [
        {to: '/blog', label: '技术博客', position: 'left'},
        {
          href: 'https://github.com/WncFht',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.zhihu.com/people/fht-64',
          label: '知乎',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '内容',
          items: [
            {
              label: '技术博客',
              to: '/blog',
            },
            {
              label: '博客归档',
              to: '/blog/archive',
            },
          ],
        },
        {
          title: '联系方式',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/WncFht',
            },
            {
              label: '知乎',
              href: 'https://www.zhihu.com/people/fht-64',
            },
            {
              label: 'Email',
              href: 'mailto:fanghaotian@sjtu.edu.cn',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Haotian Fang (WncFht). Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
