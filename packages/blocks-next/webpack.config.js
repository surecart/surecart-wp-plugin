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

		return entries;
	},
};
