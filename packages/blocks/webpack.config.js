const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	...defaultConfig,
	resolve: {
		alias: {
			'@scripts': path.resolve(__dirname, '..', '..', 'packages'),
			'@blocks': path.resolve(__dirname, 'Blocks'),
			'@admin': path.resolve(__dirname, '..', '..', 'packages/admin'),
			'@surecart/data': path.resolve(
				__dirname,
				'..',
				'..',
				'packages/admin/store/data'
			),
			'@surecart/ui-data': path.resolve(
				__dirname,
				'..',
				'..',
				'packages/admin/store/ui'
			),
		},
	},
	entry: {
		library: path.resolve(__dirname, 'index.js'),
		cart: path.resolve(__dirname, 'cart.js'),
		cloak: path.resolve(__dirname, 'styles/cloak.js'),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		...defaultConfig.plugins,
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
};
