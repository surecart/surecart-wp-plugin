import { maybeConvertAmount } from '../../utilities/currency';

/**
 * Handle search event for Facebook.
 */
window.addEventListener('scSearched', function (e) {
	if (!window?.fbq) return;

	const { searchString, searchResultIds } = e.detail;

	window.fbq('track', 'Search', {
		search_string: searchString,
		content_ids: searchResultIds,
	});
});

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', function (e) {
	if (!window?.fbq) return;

	// get the added item from the event.
	const item = e.detail;

	// sanity check.
	if (!item?.price?.product) return;

	const product = item?.price?.product;
	const productCollections =
		product?.product_collections?.data?.map(
			(collection) => collection.name
		) || [];

	window.fbq('track', 'AddToCart', {
		...(productCollections.length
			? { content_category: productCollections.join(', ') }
			: {}),
		content_ids: [product.id],
		content_name:
			product?.name +
			(item?.variant_options?.length
				? ` - ${item?.variant_options.join(' / ')}`
				: ''),
		content_type: 'product',
		contents: [
			{
				id: product.id,
				quantity: item.quantity,
			},
		],
		currency: item?.price?.currency,
		value: item?.price?.converted_amount || 0,
	});
});

/**
 * Handle view content event.
 */
window.addEventListener('scProductViewed', function (e) {
	if (!window?.fbq) return;

	const product = e.detail;

	window.fbq('track', 'ViewContent', {
		content_ids: [product.id],
		content_category: product?.product_collections?.data
			?.map((collection) => collection.name)
			.join(', '),
		content_name:
			product?.name +
			(product?.variant_options?.length
				? ` - ${product?.variant_options.join(' / ')}`
				: ''),
		content_type: 'product',
		contents: [
			{
				id: product.id,
				quantity: 1,
			},
		],
		currency: product?.price?.currency,
		value: maybeConvertAmount(
			product.price?.amount || 0,
			product.price?.currency || 'USD'
		),
	});
});
