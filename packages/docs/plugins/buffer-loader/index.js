var webpack = require('webpack');

module.exports = function () {
	return {
		name: 'custom-webpack',
		configureWebpack() {
			return {
				resolve: {
					fallback: {
						stream: require.resolve('stream-browserify'),
						buffer: require.resolve('buffer'),
					},
				},
				plugins: [
					// Work around for Buffer is undefined:
					// https://github.com/webpack/changelog-v5/issues/10
					new webpack.ProvidePlugin({
						Buffer: ['buffer', 'Buffer'],
						process: 'process/browser',
					}),
					new webpack.ProvidePlugin({
						process: 'process/browser',
					}),
				],
			};
		},
	};
};
