import CreateCustomer from './CreateCustomer';
import EditCustomer from './EditCustomer';
import { store } from '@surecart/data';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';

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

export default () => {
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
			setBrowserURL(id);
		}
	};

	// get the id from the url.
	const id = useSelect((select) => select(store).selectPageId());

	return id ? <EditCustomer id={id} /> : <CreateCustomer setId={setId} />;
};
