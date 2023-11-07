export const productNameWithPrice = (price) => {
	if (!price) {
		return '';
	}
	return `${price?.product?.name} ${price?.name ? `— ${price.name}` : ''}`;
};

/**
 * Get the product SKU text.
 *
 * If product has a variant, return the variant SKU.
 * Otherwise return the product SKU and if not return empty string.
 *
 * @param {object} lineItem
 * @param {string} variantLabel
 * @returns {string}
 */
export const getSKUText = (lineItem) =>
	lineItem?.variant?.sku || lineItem?.price?.product?.sku || '';

/**
 * Get the product SKU text by variant and price.
 *
 * If product has a variant, return the variant SKU.
 * Otherwise return the product SKU and if not return empty string.
 * 
 * @param {object} variant
 * @param {object} price
 *
 * @returns {string}
 */
export const getSKUTextByVariantAndPrice = (variant, price) =>
	variant?.sku || price?.product?.sku || '';
