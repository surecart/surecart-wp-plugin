const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
		['admin/orders']: path.resolve(
			__dirname,
			'packages/admin/orders/index.js'
		),
		['admin/invoices']: path.resolve(
			__dirname,
			'packages/admin/invoices/index.js'
		),
		['admin/settings']: path.resolve(
			__dirname,
			'packages/admin/settings/index.js'
		),
		['admin/product-groups']: path.resolve(
			__dirname,
			'packages/admin/product-groups/index.js'
		),
		['admin/subscriptions/show']: path.resolve(
			__dirname,
			'packages/admin/subscriptions/show/index.js'
		),
		['admin/subscriptions/edit']: path.resolve(
			__dirname,
			'packages/admin/subscriptions/edit/index.js'
		),
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
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(
						__dirname,
						'node_modules/@surecart/components/dist/surecart/icon-assets'
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
