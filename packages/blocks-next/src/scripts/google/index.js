import { maybeConvertAmount } from '../../utilities/currency';

/**
 * Track an event with Google Analytics or Google Tag Manager
 *
 * @param {string} googleEventName - The name of the event to track
 * @param {Object} eventData - The data to send with the event
 *
 * @returns {void}
 */
export const trackEvent = (googleEventName, eventData) => {
	if (!window.dataLayer && !window.gtag) return;
	if (!eventData) return;

	// Handle gtag for Google Analytics
	if (window.gtag) {
		window.gtag('event', googleEventName, eventData);
		return;
	}

	// Handle dataLayer for Google Tag Manager
	window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce transactions
	window.dataLayer.push({
		event: googleEventName,
		ecommerce: eventData,
	});
};

/**
 * Handle search event for Google.
 */
document.addEventListener('scSearched', (e) => {
	trackEvent('search', {
		search_term: e.detail?.searchString,
	});
});

/**
 * Handle view items event.
 */
window.addEventListener('scProductsViewed', (e) => {
	const eventDetail = e.detail;
	const { pageTitle, products } = eventDetail;
	trackEvent('view_item_list', {
		item_list_name: pageTitle,
		items:
			eventDetail &&
			products &&
			products.map((product) => ({
				item_id: product && product.id,
				item_name: product && product.name,
				...(product &&
				product.product_collections &&
				product.product_collections.data &&
				product.product_collections.data.length
					? {
							item_category: product.product_collections.data
								.map((collection) => collection.name)
								.join(', '),
					  }
					: {}),
				item_list_name: eventDetail.pageTitle,
			})),
	});
});

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', (e) => {
	const item = e.detail;

	// sanity check.
	if (!item?.price?.product) return;

	trackEvent('add_to_cart', {
		currency: item.price?.currency,
		value: item?.price?.converted_amount || 0,
		items: [
			{
				item_id: item.price?.product?.id,
				item_name: item.price?.product?.name,
				item_variant: (item.variant_options || []).join(' / '),
				price: item?.price?.converted_amount || 0,
				currency: item.price?.currency,
				quantity: item.quantity,
				discount: item?.discount_amount
					? item?.converted_discount_amount
					: 0,
			},
		],
	});
});

/**
 * Handle remove from cart event.
 */
window.addEventListener('scRemovedFromCart', (e) => {
	const item = e.detail;

	// sanity check.
	if (!item?.price?.product) return;

	trackEvent('remove_from_cart', {
		currency: item.price?.currency,
		value: item?.price?.converted_amount || 0,
		items: [
			{
				item_id: item.price?.product?.id,
				item_name: item.price?.product?.name,
				item_variant: (item.variant_options || []).join(' / '),
				price: item?.price?.converted_amount || 0,
				currency: item.price?.currency,
				quantity: item.quantity,
				discount: item?.discount_amount
					? item?.converted_discount_amount
					: 0,
			},
		],
	});
});

/**
 * Handle view cart event.
 */
window.addEventListener('scViewedCart', (e) => {
	const checkout = e.detail;

	trackEvent('view_cart', {
		currency: checkout.currency,
		value: checkout.converted_total_amount,
		items: (checkout.line_items?.data || []).map((item) => ({
			item_id: item?.price?.product?.id,
			item_name: item?.price?.product?.name,
			currency: item.price?.currency,
			discount: item?.discount_amount
				? item?.converted_discount_amount
				: 0,
			price: item?.price?.converted_amount || 0,
			quantity: item.quantity,
			...(item?.variant_options?.length
				? { item_variant: (item.variant_options || []).join(' / ') }
				: {}),
		})),
	});
});

/**
 * Handle the product viewed event.
 */
window.addEventListener('scProductViewed', (e) => {
	const product = e.detail;
	trackEvent('view_item', {
		value: maybeConvertAmount(
			product.price?.amount || 0,
			product.price?.currency || 'USD'
		),
		currency: product.price?.currency,
		items: [
			{
				item_id: product?.id,
				item_name: product?.name,
				currency: product?.price?.currency,
				discount: product?.discount_amount
					? maybeConvertAmount(
							product?.discount_amount,
							product?.price?.currency
					  )
					: 0,
				price: maybeConvertAmount(
					product?.price?.amount,
					product?.price?.currency
				),
				quantity: product?.quantity || 1,
				...(product?.variant_options?.length
					? {
							item_variant: product?.variant_options
								.map((option) => option.name)
								.join(' / '),
					  }
					: {}),
				...(product?.product_collections?.data?.length
					? {
							item_category: product?.product_collections?.data
								?.map((collection) => collection.name)
								.join(', '),
					  }
					: {}),
			},
		],
	});
});
