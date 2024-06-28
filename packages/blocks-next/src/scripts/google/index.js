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
