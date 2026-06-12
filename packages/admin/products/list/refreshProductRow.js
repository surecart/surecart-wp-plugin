import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { select, dispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

// Refresh one product's lean row after a variant edit changes its
// aggregates (price range, stock). Receiving merges into the items map the
// list query materializes from — the row updates in place without
// refetching the whole list. `expand` must mirror the list query's, or
// unexpanded relation ids would clobber the expanded objects on merge.
export const refreshProductRow = async (productId, { expand } = {}) => {
	const { baseURL, baseURLParams } =
		select(coreStore).getEntityConfig('surecart', 'product') || {};
	const product = await apiFetch({
		path: addQueryArgs(`${baseURL}/${productId}`, {
			...baseURLParams,
			expand,
		}),
	});
	dispatch(coreStore).receiveEntityRecords('surecart', 'product', product);
};
