export const newCartTemplate = (attributes, childBlocks) => {
	const getChildBlocksAttributes = (blockName) => {
		return childBlocks[0]?.innerBlocks.find(
			(block) => block.name === blockName
		)?.attributes;
	};

	const blockNames = [
		'surecart/cart-header',
		'surecart/cart-items',
		'surecart/cart-coupon',
		'surecart/cart-bump-line-item',
		'surecart/cart-subtotal',
		'surecart/cart-message',
		'surecart/cart-submit',
	];

	const [
		headerAttributes,
		itemsAttributes,
		couponAttributes,
		bumpLineItemAttributes,
		subtotalAttributes,
		messageAttributes,
		submitAttributes,
	] = blockNames.map(getChildBlocksAttributes);

	return [
		['surecart/slide-out-cart-header', headerAttributes],
		['surecart/slide-out-cart-items', itemsAttributes],
		['surecart/slide-out-cart-coupon', couponAttributes],
		['surecart/slide-out-cart-bump-line-item', bumpLineItemAttributes],
		['surecart/slide-out-cart-subtotal', subtotalAttributes],
		['surecart/slide-out-cart-message', messageAttributes],
		['surecart/slide-out-cart-submit', submitAttributes],
	].filter(Boolean);
};
