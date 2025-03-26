/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
const { __ } = wp.i18n;

const { state: productListState } = store('surecart/product-list');

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

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		/**
		 * The product quick view dialog element.
		 * This gets cached so we can call this many times without querying the DOM.
		 */
		get dialog() {
			let dialog =
				document?.querySelector('.sc-product-quick-view-dialog') ||
				null;

			if (!dialog) {
				const { ref } = getElement();

				dialog =
					ref.parentElement.querySelector('dialog') || // Sibling dialog.
					ref.closest('dialog') || // Parent dialog.
					null;
			}

			// No dialog is found.
			if (dialog instanceof HTMLDialogElement === false) {
				return;
			}

			return dialog;
		},
	},

	actions: {
		/** Navigate to a url using the router region. */
		*navigate(event) {
			productListState.loading = true;
			const { ref } = getElement();
			const queryRef = ref.closest('[data-wp-router-region]');
			if (isValidLink(ref) && isValidEvent(event) && queryRef) {
				event.preventDefault();
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield actions.navigate(ref.href);
			}
			actions.toggle(event);
			productListState.loading = false;
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
		/**
		 * Open the product quick view dialog.
		 */
		open() {
			state.dialog?.showModal();
		},
		/**
		 * Close the product quick view dialog.
		 */
		close: () => {
			state.dialog?.close();
			actions.clearURLParam();
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
			state?.dialog?.open ? actions.close() : actions.open();
		},

		/**
		 * Close the dialog if the target is the dialog.
		 */
		closeOverlay: (e) => {
			// If the target is the dialog, close it.
			if (e.target === e.currentTarget) {
				e.currentTarget.close();
				actions.clearURLParam();
			}
		},
		/**
		 * Clear URL param.
		 */
		clearURLParam: () => {
			// Clear the URL param.
			const url = new URL(window.location.href);
			url.searchParams.delete('product-quick-view-id');
			window.history.replaceState({}, '', url);
		},
	},
	callbacks: {
		init: () => {
			// If we have reached here it means the URL has a product quick view parameter so we just open the dialog.
			actions.open();
		},
	},
});
