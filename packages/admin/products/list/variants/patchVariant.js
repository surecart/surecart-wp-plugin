import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

// Direct PATCH instead of saveEntityRecord: saving through core-data
// invalidates every variants query (invalidateCache is hardwired into it),
// which refetches all expanded rows. Callers receiveEntityRecords the
// response themselves. The URL comes from the entity registration
// (add-entities.js) — one source of truth, including baseURLParams
// ({ context: 'edit' }). `image` is expanded so the row thumbnail
// (line_item_image) survives the update.
export const patchVariant = (variantId, data) => {
	const { baseURL, baseURLParams } =
		select(coreStore).getEntityConfig('surecart', 'variant') || {};
	return apiFetch({
		path: addQueryArgs(`${baseURL}/${variantId}`, {
			...baseURLParams,
			expand: ['image'],
		}),
		method: 'PATCH',
		data,
	});
};
