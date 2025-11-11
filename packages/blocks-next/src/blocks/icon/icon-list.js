/**
 * Dynamically import all icons from the icon-assets directory
 */
const iconContext = require.context(
	'../../../../components/src/components/ui/icon/icon-assets',
	false,
	/\.svg$/
);

/**
 * Get all available icon names from the icon-assets directory
 *
 * @returns {string[]} Array of icon names (without .svg extension)
 */
export const getAvailableIcons = () => {
	return iconContext
		.keys()
		.map((key) => {
			// Extract filename without path and extension
			// ./icon-name.svg -> icon-name
			return key.replace(/^\.\//, '').replace(/\.svg$/, '');
		})
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};

export default getAvailableIcons;
