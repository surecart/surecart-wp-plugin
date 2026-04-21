/**
 * External dependencies.
 */
import { useState } from 'react';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import CreateProductCollection from './CreateProductCollection';
import EditProductCollection from './EditProductCollection';

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

export default ({ navigation }) => {
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

	const setId = (id) => {
		if (id && id !== historyId) {
			if (navigation) {
				navigation.goToEdit(id);
			} else {
				setBrowserURL(id);
			}
		}
	};

	// Get the id from the navigation hook (SPA routing).
	const id = navigation?.id;

	return id ? (
		<EditProductCollection id={id} navigation={navigation} />
	) : (
		<CreateProductCollection setId={setId} navigation={navigation} />
	);
};
