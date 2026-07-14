/**
 * External dependencies.
 */
import { store } from '@surecart/data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import CreateProductGroup from './CreateProductGroup';
import EditProductGroup from './EditProductGroup';

/**
 * Returns the Model Edit URL.
 *
 * @param {string} id Group ID.
 *
 * @return {string} Edit URL.
 */
export function getEditURL(id) {
	return addQueryArgs(window.location.href, { id });
}

export default ({ navigation } = {}) => {
	const [historyId, setHistoryId] = useState(null);

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

	// SPA-provided id; data-store fallback for standalone loads.
	const dataStoreId = useSelect((select) => select(store).selectPageId(), []);
	const id = navigation?.id || dataStoreId;

	return id ? (
		<EditProductGroup id={id} navigation={navigation} />
	) : (
		<CreateProductGroup setId={setId} navigation={navigation} />
	);
};
