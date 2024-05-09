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

// Custom debounce function
const debounce = (func, delay) => {
	let timerId;
	return function (...args) {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			func(...args);
		}, delay);
	};
};

// Define a debounced version of the search function
const debouncedSearch = debounce((term, routerState, actions, blockId) => {
	// Perform your search operation here, e.g., fetch data from an API
	console.log('Performing search for:', term);
	const url = new URL(routerState?.url);
	url.searchParams.set(`products-${blockId}-search`, term);
	actions.navigate(url.toString());
}, 200); // 200ms debounce delay

const { state } = store('surecart/product-list', {
	actions: {
		*navigate(event) {
			const { ref } = getElement();
			if (isValidLink(ref) && isValidEvent(event)) {
				event.preventDefault();
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield actions.navigate(ref.href);
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
			const { ref } = getElement();
			const { blockId } = getContext();
			if (!ref || !ref.value) {
				return;
			}
			debouncedSearch(ref?.value, routerState, actions, blockId);
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
