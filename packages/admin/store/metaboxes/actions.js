import { addFilter } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

let metaBoxesInitialized = false;

/**
 * Stores info about which Meta boxes are available in which location.
 *
 * @param {Object} metaBoxesPerLocation Meta boxes per location.
 */
export function setAvailableMetaBoxesPerLocation(metaBoxesPerLocation) {
	return {
		type: 'SET_META_BOXES_PER_LOCATIONS',
		metaBoxesPerLocation,
	};
}

/**
 * Function returning the current Meta Boxes DOM Node in the editor
 * whether the meta box area is opened or not.
 * If the MetaBox Area is visible returns it, and returns the original container instead.
 *
 * @param {string} location Meta Box location.
 *
 * @return {string} HTML content.
 */
export const getMetaBoxContainer = (location) => {
	const area = document.querySelector(
		`.edit-post-meta-boxes-area.is-${location} .metabox-location-${location}`
	);
	if (area) {
		return area;
	}

	return document.querySelector('#metaboxes .metabox-location-' + location);
};

/**
 * Initializes WordPress `postboxes` script and the logic for saving meta boxes.
 */
export const initializeMetaBoxes =
	() =>
	({ registry, select, dispatch }) => {
		// Only initialize once.
		if (metaBoxesInitialized) {
			return;
		}

		metaBoxesInitialized = true;

		// Save metaboxes on save completion, except for autosaves.
		addFilter(
			'surecart.saveProduct',
			'core/edit-post/save-metaboxes',
			(previous, options) =>
				previous.then(() => {
					return dispatch.requestMetaBoxUpdates();
				})
		);

		dispatch({
			type: 'META_BOXES_INITIALIZED',
		});
	};

/**
 * Update a metabox.
 */
export const requestMetaBoxUpdates =
	() =>
	async ({ registry, select, dispatch }) => {
		dispatch({
			type: 'REQUEST_META_BOX_UPDATES',
		});

		// Saves the wp_editor fields.
		if (window.tinyMCE) {
			window.tinyMCE.triggerSave();
		}

		// We gather all the metaboxes locations data and the base form data.
		const baseFormData = new window.FormData(
			document.querySelector('.metabox-base-form')
		);
		const activeMetaBoxLocations = select.getActiveMetaBoxLocations();
		const formDataToMerge = [
			baseFormData,
			...activeMetaBoxLocations.map(
				(location) => new window.FormData(getMetaBoxContainer(location))
			),
		];

		// Merge all form data objects into a single one.
		const formData = formDataToMerge.reduce((memo, currentFormData) => {
			for (const [key, value] of currentFormData) {
				memo.append(key, value);
			}
			return memo;
		}, new window.FormData());

		try {
			// Save the metaboxes.
			await apiFetch({
				url: window.scData.wpMetaBoxUrl,
				method: 'POST',
				body: formData,
				parse: false,
			});
			return dispatch.metaBoxUpdatesSuccess();
		} catch (e) {
			console.error(e);
			return dispatch.metaBoxUpdatesFailure();
		}
	};

/**
 * Returns an action object used to signal a successful meta box update.
 *
 * @return {Object} Action object.
 */
export function metaBoxUpdatesSuccess() {
	return {
		type: 'META_BOX_UPDATES_SUCCESS',
	};
}

/**
 * Returns an action object used to signal a failed meta box update.
 *
 * @return {Object} Action object.
 */
export function metaBoxUpdatesFailure() {
	return {
		type: 'META_BOX_UPDATES_FAILURE',
	};
}
