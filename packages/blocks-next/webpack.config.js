const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

// externals my module.
module.exports = [
	{
		...defaultConfig[0],
		entry: function () {
			const entries = defaultConfig[0].entry();

			const styleFiles = glob.sync('./src/styles/*.scss ');
			styleFiles.forEach((file) => {
				const name = file
					.replace('./src/styles/', '')
					.replace('.scss', '');
				entries[`styles/${name}`] = path.resolve(__dirname, file);
			});

			return entries;
		},
	},
	{
		...defaultConfig[1],
		entry: function () {
			const entries = defaultConfig[1].entry();

			const scriptFiles = glob.sync('./src/scripts/**/index.js');
			scriptFiles.forEach((file) => {
				const name = file
					.replace('./src/scripts/', '')
					.replace('.js', '');
				entries[`scripts/${name}`] = path.resolve(__dirname, file);
			});

			return entries;
		},
		externals: {
			...defaultConfig[1]?.externals,
			'@surecart/dialog': '@surecart/dialog',
			'@surecart/cart': '@surecart/cart',
			'@surecart/sidebar': '@surecart/sidebar',
			'@surecart/api-fetch': '@surecart/api-fetch',
			'@surecart/checkout-service': '@surecart/checkout-service',
			'@surecart/checkout-events': '@surecart/checkout-events',
			'@surecart/a11y': '@surecart/a11y',
		},
	},
];
