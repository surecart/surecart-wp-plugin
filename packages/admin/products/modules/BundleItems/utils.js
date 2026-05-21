import { addQueryArgs } from '@wordpress/url';

// `component_product` can be either a string id (newly added items) or an
// expanded product object (items loaded with the `bundle_items.component_product`
// expand). Extract the id either way.
export const componentProductIdOf = (item) => {
	const cp = item?.component_product;
	if (typeof cp === 'object' && cp !== null) return cp.id || null;
	if (typeof cp === 'string') return cp;
	return null;
};

// Display fields derived from a resolved product.
export const productView = (product) => ({
	name: product?.name || '',
	image:
		product?.line_item_image?.src ||
		product?.featured_product_media?.media?.url ||
		null,
	link: product?.id
		? addQueryArgs('admin.php', {
				page: 'sc-products',
				id: product.id,
		  })
		: null,
});

export const normalizeBundleItem = (it) => {
	const cleaned = {
		...(it.id ? { id: it.id } : {}),
		component_product: componentProductIdOf(it),
		quantity: it.quantity,
		...(it.position !== undefined ? { position: it.position } : {}),
	};

	// `basis_amount` may legitimately be null (= even split by quantity), so
	// include it only when explicitly set, to avoid clobbering an existing
	// server value with an explicit null we didn't mean to send.
	if (it.basis_amount !== undefined) {
		cleaned.basis_amount = it.basis_amount;
	}
	return cleaned;
};
