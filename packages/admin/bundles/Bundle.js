import { store } from '@surecart/data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';
import { addQueryArgs, removeQueryArgs } from '@wordpress/url';

import CreateBundle from './CreateBundle';
import EditProduct from '../products/EditProduct';

/**
 * Returns the Model Edit URL.
 *
 * @param {number} id Bundle ID.
 *
 * @return {string} Bundle edit URL.
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
	 * Replaces the browser URL with an edit link for a given id.
	 *
	 * @param {Object} args Args including `id`.
	 */
	const setBrowserURL = (args) => {
		const { id } = args;
		if (!id) return;
		if (JSON.stringify(args) === JSON.stringify(history)) return;
		window.history.replaceState({ id }, 'Post ' + id, getEditURL(args));
		setHistory(args);
	};

	const id = useSelect((select) => select(store).selectPageId());

	return id ? (
		<EditProduct id={id} setBrowserURL={setBrowserURL} />
	) : (
		<CreateBundle
			onCreateProduct={(id) => {
				window.location.assign(getEditURL({ id, status: 'publish' }));
			}}
		/>
	);
};
