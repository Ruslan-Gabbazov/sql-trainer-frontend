// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Тренажёр SQL",
  tagline: "Тренажёр и учебник PostgreSQL",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://Ruslan-Gabbazov.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/sql-trainer-frontend/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Ruslan-Gabbazov", // Usually your GitHub org/username.
  projectName: "sql-trainer-frontend", // Usually your repo name.

  trailingSlash: true,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ru",
    locales: ["ru"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themes: [
    // ... Your other themes.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        searchResultLimits: 12,
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: false,
        language: ["ru", "en"],
        // ```
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/logo.png",
      navbar: {
        title: "Тренажёр SQL",
        logo: {
          alt: "Тренажёр SQL",
          src: "img/logo.png",
        },
        items: [
          { to: "/docs/lectures", type: "docSidebar", sidebarId: "lecturesSidebar", position: "left", label: "Лекции" },
          { to: "/docs/labs", type: "docSidebar", sidebarId: "labsSidebar", label: "Лабораторные", position: "left" },
          { to: "/sandbox-one", label: "Песочница", position: "left" },
          // {
          //   href: 'https://github.com/Ruslan-Gabbazov/sql-trainer-frontend',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      docs: {
        sidebar: {
          hideable: true,
          // autoCollapseCategories: true,
        },
      },
      metadata: [
        { name: "description", content: "Tренажёр SQL и учебник PostgreSQL" },
        { name: "keywords", content: "КАИ, КНИТУ-КАИ, SQL, Тренажёр SQL, Песочница SQL, Базы данных, БД, " },
        { name: "language", content: "ru" },
        { name: "og:title", content: "Tренажёр SQL" },
        { name: "og:description", content: "Тренажёр и учебник PostgreSQL для изучения SQL." },
        { name: "og:type", content: "website" },
        { name: "og:url", content: "https://ruslan-gabbazov.github.io/sql-trainer-frontend/" },
        { name: "og:image", content: "https://ruslan-gabbazov.github.io/sql-trainer-frontend/img/logo.svg" },
      ],
      headTags: [
        {
          tagName: "link",
          attributes: {
            rel: "preconnect",
            href: "https://github.com",
          },
        },
        {
          tagName: "script",
          attributes: {
            type: "application/ld+json",
          },
          innerHTML: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Y4:0",
            name: "Tренажёр SQL",
            description: "Тренажёр и учебник PostgreSQL для изучения SQL.",
            url: "https://ruslan-gabbazov.github.io/sql-trainer-frontend/",
            logo: "https://ruslan-gabbazov.github.io/sql-trainer-frontend/img/logo.svg",
          }),
        },
      ],
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
