export function scProductViewed(product, selectedPrice, quantity = 1) {
	const event = new CustomEvent('scProductViewed', {
		detail: {
			id: product?.id,
			name: product?.name,
			price: selectedPrice,
			permalink: product?.permalink,
			prices: product?.prices,
			variant_options: product?.variant_options?.data,
			product_collections: product?.product_collections,
			quantity,
		},
		bubbles: true,
	});

	document.dispatchEvent(event);
}
