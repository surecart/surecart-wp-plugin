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

let supersedePreviousSearch = null;

export const { state } = store('surecart/product-list', {
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
			const { history } = getContext();
			const queryRef = ref.closest('[data-wp-router-region]');
			if (isValidLink(ref) && isValidEvent(event) && queryRef) {
				event.preventDefault();
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);

				state.loading = true;
				yield actions.navigate(ref.href, {
					replace: history !== false ? false : true,
				});
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
		*onSearchInput(e) {
			e.preventDefault();

			const { value } = e.target;

			const ctx = getContext();

			// Don't navigate if the search didn't really change.
			if (value === ctx.search) {
				return;
			}

			// immediately update the UI.
			ctx.search = value;

			state.searching = true;

			// Debounce the search by 500ms to prevent multiple navigations.
			supersedePreviousSearch?.();
			const { promise, resolve, reject } = Promise.withResolvers();
			const timeout = setTimeout(resolve, 500);
			supersedePreviousSearch = () => {
				clearTimeout(timeout);
				reject();
			};
			try {
				yield promise;
			} catch {
				return;
			}

			// Get the current URL.
			const url = new URL(window.location.href);

			// reset to page 1.
			url.searchParams.delete(`${ctx.urlPrefix}-page`);

			// set param or delete it if value is empty
			value
				? url.searchParams.set(`${ctx.urlPrefix}-search`, value)
				: url.searchParams.delete(`${ctx.urlPrefix}-search`);

			state.loading = true;
			state.searching = true;

			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);

			routerActions.navigate(url.href);

			const { products } = getContext();
			const scSearchedEvent = new CustomEvent('scSearched', {
				detail: {
					searchString: value,
					searchResultCount: products?.length,
					searchResultIds: products?.map((product) => product.id),
				},
				bubbles: true,
			});
			document.dispatchEvent(scSearchedEvent);

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

			const ctx = getContext();

			// immediately update the UI.
			ctx.search = '';

			state.loading = true;
			state.searching = true;

			// Get the current URL.
			const url = new URL(window.location.href);

			// reset to page 1.
			url.searchParams.delete(`${ctx.urlPrefix}-page`);
			url.searchParams.delete(`${ctx.urlPrefix}-search`);

			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);

			routerActions.navigate(url.href);

			state.loading = false;
			state.searching = false;
		},
	},

	callbacks: {
		*onChangeProducts() {
			if (window?.dataLayer || window?.gtag) {
				yield import(
					/* webpackIgnore: true */
					'@surecart/google-events'
				);
			}

			if (window?.fbq) {
				yield import(
					/* webpackIgnore: true */
					'@surecart/facebook-events'
				);
			}

			const { products } = getContext();

			document.dispatchEvent(
				new CustomEvent('scProductsViewed', {
					detail: {
						products: products,
						pageTitle: document.title,
					},
					bubbles: true,
				})
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
