export const newCartTemplate = (childBlocks) => {
	const transformedBlocks = [];

	childBlocks.forEach((block) => {
		switch (block.name) {
			case 'surecart/cart-header':
				transformedBlocks.push([
					'surecart/slide-out-cart-header',
					block.attributes,
				]);
				break;
			case 'surecart/cart-items':
				transformedBlocks.push([
					'surecart/slide-out-cart-items',
					block.attributes,
				]);
				break;
			case 'surecart/cart-coupon':
				transformedBlocks.push([
					'surecart/slide-out-cart-coupon',
					block.attributes,
				]);
				break;
			case 'surecart/cart-bump-line-item':
				transformedBlocks.push([
					'surecart/slide-out-cart-bump-line-item',
					block.attributes,
				]);
				break;
			case 'surecart/cart-subtotal':
				transformedBlocks.push([
					'surecart/slide-out-cart-subtotal',
					block.attributes,
				]);
				break;
			case 'surecart/cart-message':
				transformedBlocks.push([
					'surecart/slide-out-cart-message',
					block.attributes,
				]);
				break;
			case 'surecart/cart-submit':
				transformedBlocks.push([
					'surecart/slide-out-cart-items-submit',
					block.attributes,
				]);
				break;
		}
	});

	return transformedBlocks.filter(Boolean);
};
