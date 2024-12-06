/**
 * WordPress dependencies
 */
import { store, getElement } from '@wordpress/interactivity';
const { state: checkoutState } = store('surecart/checkout');
const { __ } = wp.i18n;

const { state, actions } = store('surecart/cart', {
	state: {
		/**
		 * The cart dialog label.
		 */
		get ariaLabel() {
			return state.label + ' ' + __('Review your cart.', 'surecart');
		},

		/**
		 * The cart dialog element.
		 * This gets cached so we can call this many times without querying the DOM.
		 */
		get dialog() {
			let dialog = document?.querySelector('.sc-cart-drawer') || null;

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
		/**
		 * Open the cart dialog.
		 */
		open: function* () {
			state.dialog?.showModal();
			// speak the cart dialog state.
			state.label = __('Cart opened.', 'surecart');

			const { processCartViewEvent } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-events'
			);

			// Trigger cart view event.
			processCartViewEvent(checkoutState?.checkout);
		},

		/**
		 * Close the cart dialog.
		 */
		close: () => {
			state.dialog?.close();
			state.label = __('Cart closed.', 'surecart');
		},

		/**
		 * Toggle the cart dialog.
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
			}
		},
	},
});

// Listen for cart toggle event.
addEventListener('scToggleCart', actions.toggle); // Listen for checkout update on product page.
