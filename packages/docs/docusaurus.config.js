/** @type {import('@docusaurus/types').DocusaurusConfig} */
const path = require( 'path' );
// const remarkImport = require("remark-import-partial");
module.exports = {
	title: 'Presto Pay',
	tagline: 'Developer documentation.',
	url: 'https://checkout-engine-docs.netlify.app', // Url to your site with no trailing slash
	baseUrl: '/', // Base directory of your site relative to your repo
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'Checkout-Engine', // Usually your GitHub org/user name.
	projectName: 'checkout-engine-docs', // Usually your repo name.
	clientModules: [ require.resolve( './src/js/components.js' ) ],
	scripts: [ 'https://unpkg.com/swagger-client' ],
	themeConfig: {
		prism: {
			additionalLanguages: [ 'php' ],
			lineHeight: 1.5,
		},
		navbar: {
			title: 'Presto Pay',
			logo: {
				alt: 'My Site Logo',
				src: 'img/logo.svg',
			},
			items: [
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
			copyright: `Copyright © ${ new Date().getFullYear() } My Project, Inc. Built with Docusaurus.`,
		},
	},
	plugins: [ 'docusaurus-plugin-sass', './plugins/buffer-loader' ],
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve( './sidebars.js' ),
					remarkPlugins: [ require( 'remark-import-partial' ) ],
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
					customCss: require.resolve( './src/css/custom.scss' ),
				},
			},
		],
	],
};
