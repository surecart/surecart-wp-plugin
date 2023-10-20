export const productNameWithPrice = (price) => {
	if (!price) {
		return '';
	}
	return `${price?.product?.name} ${price?.name ? `— ${price.name}` : ''}`;
};

export const getSKUText = (lineItem, variantLabel) => {
	let skuText = '';

	if (variantLabel && lineItem?.variant?.sku) {
		skuText = lineItem.variant.sku;
	} else if (!variantLabel && lineItem?.price?.product?.sku) {
		skuText = lineItem.price.product.sku;
	}

	return skuText;
};
