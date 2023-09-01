export const productNameWithPrice = (price) => {
	if (!price) {
		return '';
	}
	return `${price?.product?.name} ${price?.name ? `- ${price.name}` : ''}`;
}