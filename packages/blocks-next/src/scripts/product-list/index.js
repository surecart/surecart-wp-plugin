/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const isValidLink = (ref) =>
	ref &&
	ref instanceof window.HTMLAnchorElement &&
	ref.href &&
	(!ref.target || ref.target === '_self') &&
	ref.origin === window.location.origin;

const isValidEvent = (event) =>
	event.button === 0 && // Left clicks only.
	!event.metaKey && // Open in new tab (Mac).
	!event.ctrlKey && // Open in new tab (Windows).
	!event.altKey && // Download.
	!event.shiftKey &&
	!event.defaultPrevented;

const { state, callbacks, actions } = store(
	'surecart/product-list',
	{
		actions: {
			*navigate(event) {
				const ctx = getContext();
				const { ref } = getElement();
				if (isValidLink(ref) && isValidEvent(event)) {
					event.preventDefault();

					const { actions } = yield import(
						/* webpackIgnore: true */
						'@wordpress/interactivity-router'
					);
					yield actions.navigate(ref.href);
					ctx.url = ref.href;
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
			*sort(event) {
				const ctx = getContext();
				const { actions, state: routerState } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				const url = new URL(routerState?.url);
				url.searchParams.set(
					`products-${ctx?.blockId}-sort`,
					event?.target?.value
				);
				actions.navigate(url.toString());
			},
			*filter(event) {
				const { actions, state: routerState } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				const ctx = getContext();
				const newValue = event.target.value;
				const url = new URL(routerState?.url);
				const existingParams = url.searchParams.getAll(
					`products-${ctx?.blockId}-filter`
				);
				const currentFilter = state[ctx.blockId]?.filter || [];
				const updatedFilter = [
					...new Set([...currentFilter, newValue, ...existingParams]),
				];
				const filtersString = updatedFilter.join(',');
				update({
					filter: updatedFilter,
				});
				url.searchParams.set(
					`products-${ctx?.blockId}-filter`,
					filtersString
				);
				actions.navigate(url.toString());
			},
		},
		callbacks: {
			/** Get the contextual state. */
			getState(prop) {
				const { blockId } = getContext();
				return state[blockId]?.[prop] || false;
			},
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
	},
	{ lock: true }
);

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
