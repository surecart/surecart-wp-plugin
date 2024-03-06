/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import EditAffiliationRequest from './EditAffiliationRequest';
import { store } from '@surecart/data';

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
	// Get the id from the page url.
	const id = useSelect((select) => select(store).selectPageId());

	return id ? <EditAffiliationRequest id={id} /> : null;
};
