const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	...defaultConfig,
	resolve: {
		alias: {
			'@scripts': path.resolve(__dirname, 'packages'),
			'@blocks': path.resolve(__dirname, 'packages/blocks/Blocks'),
			'@admin': path.resolve(__dirname, 'packages/admin'),
			'@surecart/data': path.resolve(
				__dirname,
				'packages/admin/store/data'
			),
			'@surecart/ui-data': path.resolve(
				__dirname,
				'packages/admin/store/ui'
			),
		},
	},
	entry: {
		['admin/onboarding']: path.resolve(
			__dirname,
			'packages/admin/onboarding/index.js'
		),
		['admin/dashboard']: path.resolve(
			__dirname,
			'packages/admin/dashboard/index.js'
		),
		['admin/coupons']: path.resolve(
			__dirname,
			'packages/admin/coupons/index.js'
		),
		['admin/products']: path.resolve(
			__dirname,
			'packages/admin/products/index.js'
		),
		['admin/customers']: path.resolve(
			__dirname,
			'packages/admin/customers/index.js'
		),
		['admin/affiliations']: path.resolve(
			__dirname,
			'packages/admin/affiliations/index.js'
		),
		['admin/affiliation-requests']: path.resolve(
			__dirname,
			'packages/admin/affiliation-requests/index.js'
		),
		['admin/affiliation-referrals']: path.resolve(
			__dirname,
			'packages/admin/affiliation-referrals/index.js'
		),
		['admin/affiliation-payouts']: path.resolve(
			__dirname,
			'packages/admin/affiliation-payouts/index.js'
		),
		['admin/affiliation-payouts-groups']: path.resolve(
			__dirname,
			'packages/admin/affiliation-payouts-groups/index.js'
		),
		['admin/checkouts']: path.resolve(
			__dirname,
			'packages/admin/checkouts/index.js'
		),
		['admin/orders']: path.resolve(
			__dirname,
			'packages/admin/orders/index.js'
		),
		['admin/abandoned-checkouts']: path.resolve(
			__dirname,
			'packages/admin/abandoned-checkouts/index.js'
		),
		['admin/invoices']: path.resolve(
			__dirname,
			'packages/admin/invoices/index.js'
		),
		['admin/licenses']: path.resolve(
			__dirname,
			'packages/admin/licenses/index.js'
		),
		['admin/product-groups']: path.resolve(
			__dirname,
			'packages/admin/product-groups/index.js'
		),
		['admin/product-collections']: path.resolve(
			__dirname,
			'packages/admin/product-collections/index.js'
		),
		['admin/bumps']: path.resolve(
			__dirname,
			'packages/admin/bumps/index.js'
		),
		['admin/upsell-funnels']: path.resolve(
			__dirname,
			'packages/admin/upsell-funnels/index.js'
		),
		['admin/subscriptions/show']: path.resolve(
			__dirname,
			'packages/admin/subscriptions/show/index.js'
		),
		['admin/subscriptions/edit']: path.resolve(
			__dirname,
			'packages/admin/subscriptions/edit/index.js'
		),

		/**
		 * Settings.
		 */
		['admin/settings/account']: path.resolve(
			__dirname,
			'packages/admin/settings/account/index.js'
		),
		['admin/settings/affiliation-protocol']: path.resolve(
			__dirname,
			'packages/admin/settings/affiliation-protocol/index.js'
		),
		['admin/settings/abandoned']: path.resolve(
			__dirname,
			'packages/admin/settings/abandoned/index.js'
		),
		['admin/settings/subscription']: path.resolve(
			__dirname,
			'packages/admin/settings/subscription/index.js'
		),
		['admin/settings/subscription-preservation']: path.resolve(
			__dirname,
			'packages/admin/settings/subscription-preservation/index.js'
		),
		['admin/settings/processors']: path.resolve(
			__dirname,
			'packages/admin/settings/processors/index.js'
		),
		['admin/settings/tax']: path.resolve(
			__dirname,
			'packages/admin/settings/tax/index.js'
		),
		['admin/settings/export']: path.resolve(
			__dirname,
			'packages/admin/settings/export/index.js'
		),
		['admin/settings/tax-region']: path.resolve(
			__dirname,
			'packages/admin/settings/tax-region/index.js'
		),
		['admin/settings/brand']: path.resolve(
			__dirname,
			'packages/admin/settings/brand/index.js'
		),
		['admin/settings/order']: path.resolve(
			__dirname,
			'packages/admin/settings/order/index.js'
		),
		['admin/settings/customer']: path.resolve(
			__dirname,
			'packages/admin/settings/customer/index.js'
		),
		['admin/settings/connection']: path.resolve(
			__dirname,
			'packages/admin/settings/connection/index.js'
		),
		['admin/settings/advanced']: path.resolve(
			__dirname,
			'packages/admin/settings/advanced/index.js'
		),
		['admin/settings/upgrade']: path.resolve(
			__dirname,
			'packages/admin/settings/upgrade/index.js'
		),
		['admin/settings/shipping']: path.resolve(
			__dirname,
			'packages/admin/settings/shipping/index.js'
		),
		['admin/settings/shipping/profile']: path.resolve(
			__dirname,
			'packages/admin/settings/shipping/profile/index.js'
		),
		['admin/settings/integrations']: path.resolve(
			__dirname,
			'packages/admin/settings/integrations/index.js'
		),
		['admin/settings/display-currency']: path.resolve(
			__dirname,
			'packages/admin/settings/display-currency/index.js'
		),

		/**
		 * Data.
		 */
		['store/data']: path.resolve(
			__dirname,
			'packages/admin/store/data/register/index.js'
		),
		['store/ui']: path.resolve(
			__dirname,
			'packages/admin/store/ui/register.js'
		),
		['components/static-loader']: path.resolve(
			__dirname,
			'packages/components/static-loader.js'
		),

		/**
		 * Templates
		 */
		['templates/admin']: path.resolve(
			__dirname,
			'packages/pages/admin/index.js'
		),
		['templates/instant-checkout']: path.resolve(
			__dirname,
			'packages/pages/instant-checkout/index.js'
		),
		['templates/customer-dashboard']: path.resolve(
			__dirname,
			'packages/pages/customer-dashboard/index.js'
		),

		/**
		 * Styles.
		 */
		['styles/webhook-notice']: path.resolve(
			__dirname,
			'packages/admin/styles/webhook-notice.js'
		),
		/**
		 * Deactivation survey.
		 */
		['styles/plugin-deactivation-feedback']: path.resolve(
			__dirname,
			'styles/plugin-deactivation-feedback.css'
		),
		['scripts/plugin-deactivation-feedback']: path.resolve(
			__dirname,
			'scripts/plugin-deactivation-feedback.js'
		),
	},
	output: {
		filename: '[name].js',
		chunkFilename: `[name].js?v=[chunkhash]`,
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	optimization: {
		...defaultConfig.optimization,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				exclude: /\.entry\.js$/,
				terserOptions: {
					output: {
						comments: /translators:/i,
					},
					compress: {
						passes: 2,
					},
					mangle: {
						reserved: ['__', '_n', '_nx', '_x'],
					},
				},
				extractComments: false,
			}),
		],
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(
						__dirname,
						'./packages/components/src/components/ui/icon/icon-assets'
					),
					to: path.resolve(__dirname, 'dist/icon-assets'),
				},
				{
					from: './packages/components/dist',
					to: './components/',
					toType: 'dir',
				},
				{
					from: './packages/blocks/dist',
					to: './blocks/',
					toType: 'dir',
				},
				{
					from: './packages/components/docs/kses.json',
					to: '../app/src/Support/kses.json',
				},
			],
		}),
	],
};
console.log('__dirname', __dirname);
