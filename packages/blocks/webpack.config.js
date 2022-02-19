const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

module.exports = {
	...defaultConfig,
	entry: glob.sync('./Blocks/**/src/*.js').reduce((acc, path) => {
		const entry = path
			.replace('Blocks/', '')
			.replace('/src', '')
			.replace('.js', '')
			.toLowerCase();
		acc[entry] = path;
		return acc;
	}, {}),
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		// ...defaultConfig.optimization,
		splitChunks: {
			chunks: 'all',
		},
	},
};
