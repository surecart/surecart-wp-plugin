/**
 * Returns the list of all the available meta boxes for a given location.
 *
 * @param {Object} state    Global application state.
 * @param {string} location Meta box location to test.
 *
 * @return {?Array} List of meta boxes.
 */
export function getMetaBoxesPerLocation(state, location) {
	return state.metaBoxes.locations[location];
}

/**
 * Returns true if meta boxes are initialized.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether meta boxes are initialized.
 */
export function areMetaBoxesInitialized(state) {
	return state.metaBoxes.initialized;
}

/**
 * Returns true if the post is using Meta Boxes
 *
 * @param {Object} state Global application state
 *
 * @return {boolean} Whether there are metaboxes or not.
 */
export function hasMetaBoxes(state) {
	return getActiveMetaBoxLocations(state).length > 0;
}

/**
 * Returns an array of active meta box locations.
 *
 * @param {Object} state Post editor state.
 *
 * @return {string[]} Active meta box locations.
 */
export function getActiveMetaBoxLocations(state) {
	return Object.keys(state.metaBoxes.locations);
}

/**
 * Returns true if the Meta Boxes are being saved.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether the metaboxes are being saved.
 */
export function isSavingMetaBoxes(state) {
	return state.metaBoxes.isSaving;
}
