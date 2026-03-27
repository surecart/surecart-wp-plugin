import { store } from '@surecart/data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

import CreateFunnel from './CreateFunnel';
import EditFunnel from './EditFunnel';

/**
 * Returns the Model Edit URL.
 *
 * @param {number} id Product ID.
 * @param {string} enabled Product enabled.
 *
 * @return {string} Product edit URL.
 */
export function getEditURL({ id, ...query }) {
	return addQueryArgs(window.location.href, {
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
	 */
	const setBrowserURL = (args) => {
		const { id } = args;
		// we need an id.
		if (!id) return;
		// history didn't change.
		if (JSON.stringify(args) === JSON.stringify(history)) return;
		// replace the state
		window.history.replaceState({ id }, 'Post ' + id, getEditURL(args));
		// set history for next time.
		setHistory(args);
	};
	// set the id in the url.
	const setId = (id) => setBrowserURL({ id });
	// get the id from the url.
	const id = useSelect((select) => select(store).selectPageId());

	return id ? (
		<EditFunnel id={id} setBrowserURL={setBrowserURL} />
	) : (
		<CreateFunnel setId={setId} />
	);
};
