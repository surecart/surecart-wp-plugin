import { store } from '@surecart/data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';
import { addQueryArgs, removeQueryArgs } from '@wordpress/url';

import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';

/**
 * Returns the Model Edit URL.
 *
 * @param {number} id Product ID.
 * @param {string} status Product status.
 *
 * @return {string} Product edit URL.
 */
export function getEditURL({ id, ...query }) {
	return addQueryArgs(removeQueryArgs(window.location.href, 'status'), {
		id,
		...(!!query ? query : {}),
	});
}

export default () => {
	const [history, setHistory] = useState(null);

	/**
	 * Replaces the browser URL with a edit link for a given id ID.
	 *
	 * Note it is important that, since this function may be called when the
	 * editor first loads, the result generated `getPostEditURL` matches that
	 * produced by the server. Otherwise, the URL will change unexpectedly.
	 *
	 * @param {number} id id for the model for which to generate edit URL.
	 * @param {string} status Product status.
	 */
	const setBrowserURL = (args) => {
		const { id, ...query } = args;
		// we need an id.
		if (!id) return;
		// history didn't change.
		if (JSON.stringify(args) === JSON.stringify(history)) return;
		// replace the state
		window.history.replaceState({ id }, 'Post ' + id, getEditURL(args));
		// set history for next time.
		setHistory(args);
	};

	// get the id from the store.
	const id = useSelect((select) => select(store).selectPageId());

	return id ? (
		<EditProduct id={id} setBrowserURL={setBrowserURL} />
	) : (
		<CreateProduct
			onCreateProduct={(id) => {
				setBrowserURL({ id, status: 'publish' });
			}}
		/>
	);
};
