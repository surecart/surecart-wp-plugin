// Pseudo-row markers — namespaced to avoid colliding with product fields.
// Shape mirrors the proposed core DataViews hierarchical API
// (Gutenberg #72654) so we can swap to native props when it ships.
export const VARIANT_FLAG = '__sc_isVariant';
export const VARIANT_PARENT = '__sc_parent';
export const VARIANT_ID = '__sc_variantId';
// Loading/error stand-in rows shown while variants fetch lazily.
export const VARIANT_PLACEHOLDER = '__sc_variantPlaceholder';

// product.variants comes flat from the detail endpoint, enveloped
// (`{ data: [...] }`) from the list endpoint. Always normalize.
export const readVariants = (product) => {
	const raw = product?.variants;
	if (Array.isArray(raw)) return raw;
	if (Array.isArray(raw?.data)) return raw.data;
	return [];
};

export const productHasVariants = (product) => readVariants(product).length > 0;

// The lean list response doesn't expand `variants` — option definitions are
// the cheap signal that an expander should be shown at all.
export const productHasVariantOptions = (product) => {
	const raw = product?.variant_options;
	const list = Array.isArray(raw)
		? raw
		: Array.isArray(raw?.data)
		? raw.data
		: [];
	return list.length > 0;
};

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

const placeholderRow = (product, state) => ({
	id: `variant-${state}:${product?.id}`,
	[VARIANT_FLAG]: true,
	[VARIANT_PLACEHOLDER]: state,
	[VARIANT_PARENT]: product,
});

// Flatten products + their (live) variants into a single array when
// the product is in `expandedIds`. Pure function, unit-testable.
// `lazy` carries lazily fetched state: variants per product id, plus
// in-flight/failed ids which render as a single placeholder row.
export default function injectVariantRows(products, expandedIds, lazy = {}) {
	if (!Array.isArray(products) || products.length === 0)
		return products || [];
	if (!expandedIds || expandedIds.size === 0) return products;

	const { variantsByProduct, loadingIds, failedIds } = lazy;

	const out = [];
	for (const product of products) {
		out.push(product);
		if (!expandedIds.has(product?.id)) continue;

		if (loadingIds?.has(product?.id)) {
			out.push(placeholderRow(product, 'loading'));
			continue;
		}
		if (failedIds?.has(product?.id)) {
			out.push(placeholderRow(product, 'error'));
			continue;
		}

		const variants =
			variantsByProduct?.[product?.id] ?? readVariants(product);

		variants.filter(isLiveVariant).forEach((variant, index) => {
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
export const isVariantPlaceholder = (item) => !!item?.[VARIANT_PLACEHOLDER];
export const getVariantParent = (item) => item?.[VARIANT_PARENT] || null;
export const getVariantOriginalId = (item) => item?.[VARIANT_ID] || null;

/** Strip injected variant rows before product-only bulk handlers. */
export const productOnlyItems = (items) =>
	(items || []).filter((item) => !isVariantRow(item));
