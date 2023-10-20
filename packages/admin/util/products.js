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
 * If product does not have a variant and has product SKU return the product SKU.
 * Otherwise return nothing. We don't show any fallback SKU if variant SKU is not set.
 *
 * @param {object} lineItem
 * @param {string} variantLabel
 * @returns {string}
 */
export const getSKUText = (lineItem) => {
	if (lineItem?.variant) {
		return lineItem.variant.sku;
	}
	if (lineItem?.price?.product?.sku) {
		return lineItem.price.product.sku;
	}
	return '';
};
