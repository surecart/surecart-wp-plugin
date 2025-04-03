/**
 * WordPress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * Check if the event is a valid click event.
 */
const isValidEvent = (event) =>
	event.button === 0 && // Left clicks only.
	!event.metaKey && // Open in new tab (Mac).
	!event.ctrlKey && // Open in new tab (Windows).
	!event.altKey && // Download.
	!event.shiftKey;

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		loading: false,
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
		set dialog(value) {
			if (value instanceof HTMLDialogElement === false) {
				return;
			}

			// Set the dialog.
			this.dialog = value;
		},
	},

	actions: {
		/** Navigate to a url using the router region. */
		*navigate(event) {
			state.loading = true;
			actions.toggle(event);
			const { ref } = getElement();
			const { url } = getContext();
			const queryRef = ref.closest('[data-wp-router-region]');
			if (isValidEvent(event) && queryRef) {
				event.preventDefault();
				const { actions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield actions.navigate(url, {
					replace: true,
				});
			}

			const quickViewClose = queryRef.querySelector(
				'.c-product-quick-view-dialog__close'
			);
			// Focus the product title to ensure the product page doe snot scroll to bottom after popup opens.
			quickViewClose?.focus();
			state.loading = false;
		},
		/** Prefetch upcoming urls. */
		*prefetch() {
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
			// If we have reached here it means the URL has a product quick view parameter so we just open the dialog.
			actions.open();
		},
		updateDialog: () => {
			if (state.dialog && state.dialog instanceof HTMLDialogElement) {
				return;
			}

			// make sure the dialog state is up to date with latest HTML dialog element.
			let latestDialog =
				document?.querySelector('.sc-product-quick-view-dialog') ||
				null;

			state.dialog = latestDialog;
		},
	},
});
