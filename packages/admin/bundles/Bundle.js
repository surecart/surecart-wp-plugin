import { useState } from 'react';
import { addQueryArgs, removeQueryArgs } from '@wordpress/url';

import CreateBundle from './CreateBundle';
import EditProduct from '../products/EditProduct';

/**
 * Returns the bundle edit URL. Bundles are products with `bundle: true`, so the
 * shared EditProduct UI is reused; only the list/create wrappers differ.
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

export default ({ navigation }) => {
	const [history, setHistory] = useState(null);

	const setBrowserURL = (args) => {
		const { id } = args;
		if (!id) return;
		if (JSON.stringify(args) === JSON.stringify(history)) return;
		window.history.replaceState({ id }, 'Bundle ' + id, getEditURL(args));
		setHistory(args);
	};

	// Get the id from the navigation hook (SPA routing).
	const id = navigation?.id;

	return id ? (
		<EditProduct
			id={id}
			setBrowserURL={setBrowserURL}
			navigation={navigation}
		/>
	) : (
		<CreateBundle
			navigation={navigation}
			onCreateProduct={(id) => {
				navigation.goToEdit(id, { status: 'publish' });
			}}
		/>
	);
};
