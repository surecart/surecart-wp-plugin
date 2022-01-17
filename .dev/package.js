/**
 * External dependencies
 */
const { sync: readPkgUp } = require('read-pkg-up');

const { packageJson, path: pkgPath } = readPkgUp({
	cwd: './',
});

const getPackagePath = () => pkgPath;

const getPackageProp = (prop) => packageJson && packageJson[prop];

const hasPackageProp = (prop) =>
	packageJson && packageJson.hasOwnProperty(prop);

module.exports = {
	getPackagePath,
	getPackageProp,
	hasPackageProp,
};
