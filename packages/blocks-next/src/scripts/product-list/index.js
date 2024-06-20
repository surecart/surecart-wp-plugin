/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Check if the link is valid.
 */
const isValidLink = (ref) =>
	ref &&
	ref instanceof window.HTMLAnchorElement &&
	ref.href &&
	(!ref.target || ref.target === '_self') &&
	ref.origin === window.location.origin;

/**
 * Check if the event is a valid click event.
 */
const isValidEvent = (event) =>
	event.button === 0 && // Left clicks only.
	!event.metaKey && // Open in new tab (Mac).
	!event.ctrlKey && // Open in new tab (Windows).
	!event.altKey && // Download.
	!event.shiftKey &&
	!event.defaultPrevented;

/** Debounce function that returns a promise when callback is complete. */
function debounce(func, delay) {
	let timeoutId;
	return function () {
		return new Promise((resolve) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				await func.apply(this, arguments);
				resolve();
			}, delay);
		});
	};
}

// Define a debounced version of the search function
const debouncedSearch = debounce(
	async (term, routerState, actions, blockId) => {
		// Get the current URL.
		const url = new URL(routerState?.url);

		// reset to page 1.
		url.searchParams.delete(`products-${blockId}-page`);

		// set param or delete it if term is empty
		term
			? url.searchParams.set(`products-${blockId}-search`, term)
			: url.searchParams.delete(`products-${blockId}-search`);

		// Navigate to the new URL.
		return actions.navigate(url.toString());
	},
	500
);

const { state } = store('surecart/product-list', {
	state: {
		/** Are we loading */
		loading: false,
		/** Are we searching? */
		searching: false,
	},

	actions: {
		/** Navigate to a url using the router region. */
		*navigate(event) {
			const { ref } = getElement();
			const queryRef = ref.closest('[data-wp-router-region]');
			if (isValidLink(ref) && isValidEvent(event)) {
				event.preventDefault();
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);

				state.loading = true;
				yield actions.navigate(ref.href);
				state.loading = false;

				const firstAnchor = queryRef.querySelector(
					'.sc-product-item a[href]'
				);
				// Focus the first anchor of the Query block.
				// this may move the browser window to the top of the page if it is offscreen.
				firstAnchor?.focus();
			}
		},
		/** Prefetch upcoming urls. */
		*prefetch() {
			const { ref } = getElement();
			if (isValidLink(ref)) {
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield actions.prefetch(ref.href);
			}
		},
		/** Handle search input. */
		*onSearchInput(event) {
			event.preventDefault();
			const { actions, state: routerState } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			const { ref } = getElement();
			const { blockId } = getContext();

			state.loading = true;
			state.searching = true;
			yield debouncedSearch(ref?.value, routerState, actions, blockId);
			const { products } = getContext();
			const analyticsEvent = new CustomEvent('scSearched', {
				detail: {
					searchString: ref?.value,
					searchResultCount: products?.length,
					searchResultIds: products?.map((product) => product.id),
				},
				bubbles: true,
			});
			document.dispatchEvent(analyticsEvent);
			state.loading = false;
			state.searching = false;
		},
		/** Clear the search input. */
		*clearSearch(event) {
			// no-op if not enter or space key
			if (
				event?.type === 'keydown' &&
				!['Enter', 'Space'].includes(event.key)
			) {
				return true;
			}

			event.preventDefault();

			const { actions, state: routerState } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			const { blockId } = getContext();

			state.loading = true;
			state.searching = true;
			yield debouncedSearch('', routerState, actions, blockId);
			state.loading = false;
			state.searching = false;
		},
	},

	callbacks: {
		*init() {
			yield import(
				/* webpackIgnore: true */
				'@surecart/analytics'
			);
		},
		/**
		 * This is optionally used when there is a url context,
		 * we can prefetch a page ahead of time without mouse enter (just on load)
		 */
		*prefetch() {
			const { url } = getContext();
			const { ref } = getElement();
			if (url && isValidLink(ref)) {
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield actions.prefetch(ref.href);
			}
		},
	},
});
