const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

module.exports = {
	...defaultConfig,
	entry: function () {
		const entries = defaultConfig.entry();

		const styleFiles = glob.sync('./src/styles/*.scss');
		styleFiles.forEach((file) => {
			const name = file.replace('./src/styles/', '').replace('.scss', '');
			entries[`styles/${name}`] = path.resolve(__dirname, file);
		});

		const scriptFiles = glob.sync('./src/scripts/**/index.js');
		scriptFiles.forEach((file) => {
			const name = file.replace('./src/scripts/', '').replace('.js', '');
			entries[`scripts/${name}`] = path.resolve(__dirname, file);
		});

		// TODO: remove this once the issue is fixed in @wordpress/scripts
		// This is not working because of the new module thing.
		// const viewFiles = glob.sync('./src/**/view.js');
		// viewFiles.forEach((file) => {
		// 	const entryName = file
		// 		.replace('.js', '')
		// 		.replace('src', '')
		// 		.replace(/\\/g, '/');
		// 	entries[entryName] = path.resolve(__dirname, file);
		// });

		return entries;
	},

	externals: {
		...defaultConfig.externals,
		'@wordpress/interactivity': '@wordpress/interactivity',
	},
};
