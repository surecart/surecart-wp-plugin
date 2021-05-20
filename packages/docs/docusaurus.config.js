/** @type {import('@docusaurus/types').DocusaurusConfig} */
const path = require("path");
// const remarkImport = require("remark-import-partial");
module.exports = {
  title: "Presto Pay",
  tagline: "Developer documentation.",
  url: "https://presto-pay-docs.netlify.app", // Url to your site with no trailing slash
  baseUrl: "/", // Base directory of your site relative to your repo
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "Presto-Pay", // Usually your GitHub org/user name.
  projectName: "presto-pay-docs", // Usually your repo name.
  clientModules: [require.resolve("./src/js/components.js")],
  themeConfig: {
    prism: {
      additionalLanguages: ["php"],
      lineHeight: 1.5,
    },
    navbar: {
      title: "Presto Pay",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "guide",
          position: "left",
          label: "Guide",
        },
        {
          type: "doc",
          docId: "components",
          position: "left",
          label: "Components",
        },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  plugins: ["docusaurus-plugin-sass"],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // remarkPlugins: [remarkImport],
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      },
    ],
  ],
};
