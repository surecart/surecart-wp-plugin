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

const { actions: dropdownActions } = store('surecart/dropdown');

const { state, actions } = store('surecart/product-list', {
	actions: {
		onSortMenuItemClick: (e) => {
			dropdownActions.selectItem(e);
			actions.navigate(e);
		},
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
		*onSearchSubmit(event) {
			event.preventDefault();
			const { actions, state: routerState } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			const { ref } = getElement();
			// remove filter id from state
			const { blockId } = getContext();
			const searchValue = ref?.querySelector(
				'.wp-block-surecart-product-list-search-input'
			)?.value;
			const url = new URL(routerState?.url);
			url.searchParams.set(`products-${blockId}-search`, searchValue);
			actions.navigate(url.toString());
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
