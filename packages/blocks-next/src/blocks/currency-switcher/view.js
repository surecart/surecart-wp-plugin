import { store } from '@wordpress/interactivity';

const { callbacks } = store('surecart/currency-switcher', {
	callbacks: {
		initialize() {
			callbacks.updateCurrencyLinks();

			// Set up mutation observer to watch for DOM changes
			const observer = new MutationObserver((mutations) => {
				callbacks.updateCurrencyLinks();
			});

			// Start observing the document with the configured parameters
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		},
		updateCurrencyLinks() {
			// Get current currency from URL if it exists
			const urlParams = new URLSearchParams(window.location.search);
			const currentCurrency = urlParams.get('currency');

			// If no currency parameter, no need to modify links
			if (!currentCurrency) return;

			// Find all links in the document
			document.querySelectorAll('a').forEach((link) => {
				try {
					const url = new URL(link.href);
					// Only modify links to the same origin and without existing currency param
					if (
						url.origin === window.location.origin &&
						!url.searchParams.has('currency')
					) {
						url.searchParams.set('currency', currentCurrency);
						link.href = url.toString();
					}
				} catch (e) {
					// Invalid URL, skip this link
					return;
				}
			});
		},
	},
});
