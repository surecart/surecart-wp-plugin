/**
 * Returns an action generator used in signalling that editor has initialized with
 * the specified post object and editor settings.
 *
 * @param {Object} post     Post object.
 * @param {Object} edits    Initial edited attributes object.
 * @param {Array?} template Block Template.
 */
export const setupEditor =
	(model) =>
	({ dispatch }) => {
		return {
			type: 'SETUP_EDITOR_STATE',
			model,
		};
	};
