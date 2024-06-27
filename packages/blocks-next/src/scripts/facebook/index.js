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
