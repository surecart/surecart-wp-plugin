import { store } from '@surecart/data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';
import { addQueryArgs, getQueryArg, removeQueryArgs } from '@wordpress/url';

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
export function getEditURL({ id, status }) {
	return addQueryArgs(removeQueryArgs(window.location.href, 'status'), {
		id,
		...(!!status ? { status } : {}),
	});
}

export default () => {
	const [historyId, setHistoryId] = useState(null);
	const historyStatus = getQueryArg(window.location.href, 'status');

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
		if (!args?.id) return;

		const historyArgs = {
			id: historyId,
			status: historyStatus,
		};

		if (JSON.stringify(args) === JSON.stringify(historyArgs)) return;

		window.history.replaceState({ id }, 'Post ' + id, getEditURL(args));
		setHistoryId(id);
	};

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
