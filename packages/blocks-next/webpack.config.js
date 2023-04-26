// Import the default configuration from @wordpress/scripts
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Customize the configuration
module.exports = {
	...defaultConfig,
	optimization: {
		...defaultConfig.optimization,
		splitChunks: {
			...defaultConfig.optimization.splitChunks,
			chunks: 'all',
			cacheGroups: {
				...defaultConfig.optimization.splitChunks.cacheGroups,
				stencilCoreInternal: {
					test: /[\\/]node_modules[\\/]@stencil[\\/]core[\\/]internal[\\/]/,
					name: 'stencil-core-internal',
					chunks: 'all',
					priority: 10,
				},
				// componentsGroup: {
				// 	test: (module) => {
				// 		// Check for resource path ending with *2.js
				// 		const match2js =
				// 			module.resource &&
				// 			module.resource.match(/.*2\.js$/);

				// 		// If the resource path matches *2.js, ignore it
				// 		if (match2js) {
				// 			return false;
				// 		}

				// 		// If the resource path contains the word "components", include it
				// 		const matchComponents =
				// 			module.resource &&
				// 			module.resource.match(/components/);
				// 		return !!matchComponents;
				// 	},
				// 	name: (module, chunks, cacheGroupKey) => {
				// 		const match = module.resource.match(/components/);
				// 		if (match) {
				// 			const fileName = module.resource.replace(
				// 				/.*([\\/])([^\\/]+)\.(jsx?|tsx?)$/,
				// 				'$2'
				// 			);
				// 			return `sc-${fileName}`;
				// 		}
				// 		return cacheGroupKey;
				// 	},
				// 	chunks: 'all',
				// 	enforce: true,
				// },
			},
		},
	},
};
