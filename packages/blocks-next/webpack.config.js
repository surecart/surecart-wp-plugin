const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

console.log(defaultConfig);
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
	},
	{
		...defaultConfig[1],
		entry: function () {
			const entries = defaultConfig[1].entry();

			const globalStores = glob.sync('./src/scripts/**/index.js');
			globalStores.forEach((file) => {
				const entryName = file
					.replace('.js', '')
					.replace('src', '')
					.replace(/\\/g, '/');
				entries[entryName] = path.resolve(__dirname, file);
			});

			return entries;
		},
	},
];
