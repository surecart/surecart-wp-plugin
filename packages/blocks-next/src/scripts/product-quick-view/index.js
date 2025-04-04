/**
 * WordPress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * Holds all elements that are made inert when the lightbox is open; used to
 * remove inert attribute of only those elements explicitly made inert.
 *
 * @type {Array}
 */
let inertElements = [];

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		loading: false,
		open: false,
		showClosingAnimation: false,
	},

	actions: {
		/** Navigate to a url using the router region. */
		*navigate(event) {
			state.loading = true;
			actions.toggle(event);
			const { ref } = getElement();
			const { url } = getContext();
			const queryRef = ref.closest('[data-wp-router-region]');
			if (queryRef) {
				event.preventDefault();
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield actions.navigate(url, {
					replace: true,
				});
			}

			const quickViewClose = document.querySelector(
				'.sc-product-quick-view-dialog__close-button'
			);
			// Focus the product title to ensure the product page doe snot scroll to bottom after popup opens.
			quickViewClose?.focus();

			state.loading = false;
		},
		/** Prefetch upcoming urls. */
		*prefetch(e) {
			const { url } = getContext();
			const { actions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			yield actions.prefetch(url);
		},
		/**
		 * Open the product quick view dialog.
		 */
		open() {
			state.open = true;
			// Prevent body from scrolling when the dialog is open. Add class
			document?.body?.classList?.add('sc-product-quick-view-open');
			inertElements = [];
			document
				.querySelectorAll(
					'body > :not(.sc-lightbox-overlay):not(.wp-block-surecart-product-quick-view)'
				)
				.forEach((el) => {
					if (!el.hasAttribute('inert')) {
						el.setAttribute('inert', '');
						inertElements.push(el);
					}
				});
		},
		/**
		 * Close the product quick view dialog.
		 */
		close: () => {
			state.open = false;
			state.showClosingAnimation = true;
			// Allow body to scroll when the dialog is closed.
			document?.body?.classList?.remove('sc-product-quick-view-open');
			actions.clearURLParam();
			// remove inert attribute from all children of the document
			inertElements.forEach((el) => {
				el.removeAttribute('inert');
			});
			inertElements = [];
		},

		/**
		 * Toggle the product quick view dialog.
		 */
		toggle: (e) => {
			// If the key is not space or enter, return.
			if (e?.key && e?.key !== ' ' && e?.key !== 'Enter') {
				return;
			}

			// Prevent default behavior.
			e?.preventDefault();

			// If the dialog is open, close it. Otherwise, open it.
			state?.open ? actions.close() : actions.open();
		},

		/**
		 * Close the dialog if the target is the dialog.
		 */
		closeOverlay: (e) => {
			// If the target is the dialog, close it.
			if (e.target === e.currentTarget) {
				actions.close();
			}
		},
		/**
		 * Clear URL param.
		 */
		*clearURLParam() {
			state.loading = true;
			// Clear the URL param.
			const url = new URL(window.location.href);
			url.searchParams.delete('product-quick-view-id');

			const { actions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			yield actions.navigate(url.toString(), {
				replace: true,
			});
			state.loading = false;
		},
	},
	callbacks: {
		init: () => {
			if (state?.open) {
				return;
			}

			// If we have reached here it means the URL has a product quick view parameter so we just open the dialog.
			actions.open();
		},
	},
});
