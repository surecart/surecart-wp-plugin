/** @type {import('@docusaurus/types').DocusaurusConfig} */
const path = require('path');
// const remarkImport = require("remark-import-partial");
module.exports = {
	title: 'SureCart',
	tagline: 'Developer documentation.',
	url: 'https://surecart-docs.netlify.app', // Url to your site with no trailing slash
	baseUrl: '/', // Base directory of your site relative to your repo
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'Checkout-Engine', // Usually your GitHub org/user name.
	projectName: 'surecart-docs', // Usually your repo name.
	clientModules: [require.resolve('./src/js/components.js')],
	scripts: ['https://unpkg.com/swagger-client'],
	themeConfig: {
		prism: {
			additionalLanguages: ['php'],
			lineHeight: 1.5,
		},
		navbar: {
			title: 'SureCart',
			// logo: {
			// 	alt: 'My Site Logo',
			// 	src: 'img/logo.svg',
			// },
			items: [
				{
					type: 'doc',
					docId: 'guide/guide',
					position: 'left',
					label: 'Guide',
				},
				{
					type: 'doc',
					docId: 'components',
					position: 'left',
					label: 'Components',
				},
				{
					type: 'doc',
					docId: 'models/retrieving',
					position: 'left',
					label: 'Models',
				},
				{
					type: 'doc',
					docId: 'api',
					position: 'left',
					label: 'API',
				},
				{
					type: 'doc',
					docId: 'events/actions',
					position: 'left',
					label: 'Events',
				},
				// { to: "/blog", label: "Blog", position: "left" },
				{
					href: 'https://github.com/facebook/docusaurus',
					label: 'GitHub',
					position: 'right',
				},
			],
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
					sidebarPath: require.resolve('./sidebars.js'),
					remarkPlugins: [require('remark-import-partial')],
					// remarkPlugins: [remarkImport],
					// Please change this to your repo.
					editUrl:
						'https://github.com/facebook/docusaurus/edit/master/website/',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					editUrl:
						'https://github.com/facebook/docusaurus/edit/master/website/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.scss'),
				},
			},
		],
	],
};
