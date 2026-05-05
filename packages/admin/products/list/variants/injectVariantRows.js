// Pseudo-row markers — namespaced to avoid colliding with product fields.
// Shape mirrors the proposed core DataViews hierarchical API
// (Gutenberg #72654) so we can swap to native props when it ships.
export const VARIANT_FLAG = '__sc_isVariant';
export const VARIANT_PARENT = '__sc_parent';
export const VARIANT_ID = '__sc_variantId';

// product.variants comes flat from the detail endpoint, enveloped
// (`{ data: [...] }`) from the list endpoint. Always normalize.
const readVariants = (product) => {
	const raw = product?.variants;
	if (Array.isArray(raw)) return raw;
	if (Array.isArray(raw?.data)) return raw.data;
	return [];
};

export const productHasVariants = (product) => readVariants(product).length > 0;

const isLiveVariant = (variant) =>
	!!variant && variant?.status !== 'deleted' && variant?.status !== 'draft';

// Number of variants the user will see when the row expands.
export const getActiveVariantCount = (product) =>
	readVariants(product).filter(isLiveVariant).length;

// DataViews keys rows by `id` — namespace variants so they can never
// collide with a product id at runtime.
const variantRowId = (productId, variant, index) =>
	`variant:${productId}:${
		variant?.id || `pos-${variant?.position ?? index}`
	}`;

// Flatten products + their (live) variants into a single array when
// the product is in `expandedIds`. Pure function, unit-testable.
export default function injectVariantRows(products, expandedIds) {
	if (!Array.isArray(products) || products.length === 0)
		return products || [];
	if (!expandedIds || expandedIds.size === 0) return products;

	const out = [];
	for (const product of products) {
		out.push(product);
		if (!expandedIds.has(product?.id)) continue;

		readVariants(product)
			.filter(isLiveVariant)
			.forEach((variant, index) => {
				out.push({
					...variant,
					id: variantRowId(product.id, variant, index),
					[VARIANT_ID]: variant?.id,
					[VARIANT_FLAG]: true,
					[VARIANT_PARENT]: product,
				});
			});
	}
	return out;
}

export const isVariantRow = (item) => !!item?.[VARIANT_FLAG];
export const getVariantParent = (item) => item?.[VARIANT_PARENT] || null;
export const getVariantOriginalId = (item) => item?.[VARIANT_ID] || null;
