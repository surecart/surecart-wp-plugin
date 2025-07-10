/**
 * Creates an empty OR group
 * @returns {Array} - Empty OR group with one empty AND rule
 */
export const createEmptyOrGroup = () => {
	return [
		{ attribute: null, value: null, operator: null, metadataKey: null },
	];
};

/**
 * Creates an empty AND rule
 * @returns {Array} - Empty AND rule [attribute, value, metadataKey, operator]
 */
export const createEmptyAndRule = () => {
	return { attribute: null, value: null, operator: null, metadataKey: null };
};
