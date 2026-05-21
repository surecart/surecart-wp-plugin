import { store } from '@surecart/data';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { addQueryArgs, removeQueryArgs } from '@wordpress/url';

import CreateBundle from './CreateBundle';
import EditProduct from '../products/EditProduct';

/**
 * Returns the bundle edit URL.
 *
 * @param {number} id Bundle ID.
 *
 * @return {string} Bundle edit URL.
 */
export function getEditURL({ id, ...query }) {
	return addQueryArgs(removeQueryArgs(window.location.href, 'status'), {
		id,
		...(query || {}),
	});
}

export default () => {
	const [history, setHistory] = useState(null);

	const setBrowserURL = (args) => {
		const { id } = args;
		if (!id) return;
		if (JSON.stringify(args) === JSON.stringify(history)) return;
		window.history.replaceState({ id }, 'Bundle ' + id, getEditURL(args));
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
