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
