/** @type {import('@docusaurus/types').DocusaurusConfig} */
const path = require('path');
// const remarkImport = require("remark-import-partial");
module.exports = {
	title: 'SureCart Components Docs',
	tagline: 'Developer documentation.',
	url: 'https://surecart-docs.netlify.app', // Url to your site with no trailing slash
	baseUrl: '/', // Base directory of your site relative to your repo
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'surecart', // Usually your GitHub org/user name.
	projectName: 'surecart-docs', // Usually your repo name.
	clientModules: [require.resolve('./src/js/components.js')],
	scripts: ['https://unpkg.com/swagger-client'],
	themeConfig: {
		colorMode: {
			defaultMode: 'light',
			disableSwitch: false,
			respectPrefersColorScheme: false,
		},
		prism: {
			additionalLanguages: ['php'],
			lineHeight: 1.5,
		},
		navbar: {
			title: 'SureCart Components Docs',
		},
		footer: {
			style: 'dark',
			copyright: `Copyright © ${new Date().getFullYear()} SureCart`,
		},
	},
	plugins: ['docusaurus-plugin-sass', './plugins/buffer-loader'],
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					routeBasePath: '/', // Serve the docs at the site's root
					sidebarPath: require.resolve('./sidebars.js'),
					remarkPlugins: [require('remark-import-partial')],
					// remarkPlugins: [remarkImport],
					// Please change this to your repo.
					editUrl:
						'https://github.com/facebook/docusaurus/edit/master/website/',
				},
				blog: false, // Optional: disable the blog plugin
				theme: {
					customCss: require.resolve('./src/css/custom.scss'),
				},
			},
		],
	],
};
