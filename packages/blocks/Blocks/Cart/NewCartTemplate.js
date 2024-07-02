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
		['surecart/cart-header-v2', headerAttributes],
		['surecart/cart-items-v2', itemsAttributes],
		['surecart/cart-coupon-v2', couponAttributes],
		['surecart/cart-bump-line-item-v2', bumpLineItemAttributes],
		['surecart/cart-subtotal-v2', subtotalAttributes],
		['surecart/cart-message-v2', messageAttributes],
		['surecart/cart-submit-v2', submitAttributes],
	].filter(Boolean);
};
