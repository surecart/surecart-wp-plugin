/**
 * The internal dependencies.
 */
const utils = require( '../lib/utils' );

module.exports = {
	modules: [ utils.srcScriptsPath(), 'node_modules' ],
	extensions: [ '.js', '.jsx', '.json', '.css', '.scss' ],
	alias: {
		'@config': utils.rootPath( 'config.json' ),
		'@scripts': utils.srcScriptsPath(),
		'@blocks': utils.rootPath( 'app/src/Blocks' ),
		'@styles': utils.srcStylesPath(),
		'@images': utils.srcImagesPath(),
		'@fonts': utils.srcFontsPath(),
		'@vendor': utils.srcVendorPath(),
		'@dist': utils.distPath(),
		'~': utils.rootPath( 'node_modules' ),
	},
};
