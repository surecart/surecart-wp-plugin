const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

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
	defaultConfig[1],
];
