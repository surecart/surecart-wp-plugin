const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

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
		cloak: path.resolve(__dirname, 'styles/cloak.js'),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'dist'),
	},
};
