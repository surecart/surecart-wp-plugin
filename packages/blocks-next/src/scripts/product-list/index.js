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

const throttle = (func, delay) => {
	let lastCall = 0;
	return function (...args) {
		const now = new Date().getTime();
		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	};
};
// Define a debounced version of the search function
const throttledSearch = throttle((term, routerState, actions, blockId) => {
	// Perform your search operation here, e.g., fetch data from an API
	console.log('Performing search for:', term);
	const url = new URL(routerState?.url);
	url.searchParams.set(`products-${blockId}-search`, term);
	actions.navigate(url.toString());
	state.loading = false;
}, 100);

const { state } = store('surecart/product-list', {
	state: {
		loading: false,
	},
	actions: {
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

		*onSearchClear(event) {
			if (!event.target.value) {
				const { actions, state: routerState } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				const { blockId } = getContext();
				const url = new URL(routerState?.url);
				url.searchParams.delete(`products-${blockId}-search`);
				actions.navigate(url.toString());
			}
		},

		*onSearchInput(event) {
			event.preventDefault();
			const { actions, state: routerState } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			state.loading = true;
			const { ref } = getElement();
			const { blockId } = getContext();
			if (!ref || !ref.value) {
				const url = new URL(routerState?.url);
				url.searchParams.delete(`products-${blockId}-search`);
				actions.navigate(url.toString());
				state.loading = false;
				return;
			}
			throttledSearch(ref?.value, routerState, actions, blockId);
		},
	},

	callbacks: {
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

/**
 * Update state.
 */
export const update = (data) => {
	const { blockId } = getContext();
	state[blockId] = {
		...state?.[blockId],
		...data,
	};
};
