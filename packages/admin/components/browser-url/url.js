import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

/**
 * Returns the Model Edit URL.
 *
 * @param {number} postId Post ID.
 *
 * @return {string} Post edit URL.
 */
export function getEditURL(id) {
	return addQueryArgs(window.location.href, { id });
}

export default ({ id }) => {
	const [historyId, setHistoryId] = useState(null);

	/**
	 * Replaces the browser URL with a edit link for a given id ID.
	 *
	 * Note it is important that, since this function may be called when the
	 * editor first loads, the result generated `getPostEditURL` matches that
	 * produced by the server. Otherwise, the URL will change unexpectedly.
	 *
	 * @param {number} id id for the model for which to generate edit URL.
	 */
	const setBrowserURL = (id) => {
		window.history.replaceState({ id }, 'Post ' + id, getEditURL(id));
		setHistoryId(id);
	};

	if (id && id !== historyId) {
		setBrowserURL(id);
	}

	return null;
};
