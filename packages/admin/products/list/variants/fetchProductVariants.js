import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

// The products list response is intentionally lean (no `variants`/`prices`).
// core-data's list resolver also marks each product's `getEntityRecord` as
// resolved using that lean row (and re-marks it on every list refetch), so
// useEntityRecord / getEditedEntityRecord would hand back a variant-less
// record here. Fetch the full single product directly so variant reads in
// the list view are always complete and never clobbered.
export default function fetchProductVariants(productId, options = {}) {
	return apiFetch({
		path: addQueryArgs(`/surecart/v1/products/${productId}`, {
			context: 'edit',
			expand: [ 'variants', 'variants.image', 'prices', 'variant_options' ],
		}),
		...options,
	});
}
