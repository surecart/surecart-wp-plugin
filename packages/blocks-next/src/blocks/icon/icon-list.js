// store in-memory icons list
let icons = null;

/**
 * Get all available icon names from icons.json
 *
 * @returns {Promise<string[]>} Array of icon names
 */
export const getAvailableIcons = async () => {
	if (icons) return icons;

	try {
		icons = [];
		const response = await fetch(
			`${window?.scData?.plugin_url}/dist/icon-assets/icons.json`
		);
		if (!response.ok) throw new Error(response.statusText);
		icons = await response.json();
		return icons;
	} catch (error) {
		console.error('Failed to load icons:', error);
		return [];
	}
};

export default getAvailableIcons;
