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
 * Handle search event for Facebook.
 */
window.addEventListener('scSearched', function (e) {
	if (!window?.fbq) return;

	const eventDetail = e.detail;
	window.fbq('track', 'Search', {
		search_string: eventDetail.searchString,
		content_ids: eventDetail.searchResultIds,
	});
});
