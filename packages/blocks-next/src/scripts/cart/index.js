/**
 * WordPress dependencies
 */
import { store, getElement, withSyncEvent } from '@wordpress/interactivity';
import { inertEverythingExcept, removeInert } from '../utils/inert';
const { actions: quickViewActions } = store('surecart/product-quick-view');
const { state: checkoutState, actions: checkoutActions } =
	store('surecart/checkout');
const { __ } = wp.i18n;

const { state, actions } = store('surecart/cart', {
	state: {
		open: false,
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
					ref.parentElement.querySelector('.sc-cart-drawer') || // Sibling .sc-cart-drawer.
					ref.closest('.sc-cart-drawer') || // Parent .sc-cart-drawer.
					null;
			}

			return dialog;
		},
	},

	actions: {
		/**
		 * Open the cart dialog.
		 */
		open() {
			state.open = true;

			// focus the close button.
			requestAnimationFrame(() => {
				state.dialog
					?.querySelector('.wp-block-surecart-cart-close-button')
					?.focus();
			});

			// speak the cart dialog state.
			state.label = __('Cart opened.', 'surecart');

			// fetch the checkout.
			checkoutActions.fetch();

			// Trigger cart view event.
			actions.processCartViewEvent(checkoutState?.checkout);

			// close the quick view dialog if it is open.
			quickViewActions?.close?.();

			// make all children of the document inert exempt .sc-cart-wrapper
			inertEverythingExcept(document.querySelector('.sc-cart-wrapper'));
		},

		processCartViewEvent: function* (checkout) {
			const { processCartViewEvent } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-events'
			);
			processCartViewEvent(checkoutState?.checkout);
		},

		/**
		 * Close the cart dialog.
		 */
		close: () => {
			state.open = false;

			state.label = __('Cart closed.', 'surecart');

			// remove inert attribute from all elements that were made inert.
			removeInert();
		},

		/**
		 * Toggle the cart dialog.
		 */
		toggle: withSyncEvent((e) => {
			// If the key is not space or enter, return.
			if (e?.key && e?.key !== ' ' && e?.key !== 'Enter') {
				return;
			}

			// Prevent default behavior.
			e?.preventDefault();

			// If the dialog is open, close it. Otherwise, open it.
			state?.open ? actions.close() : actions.open();
		}),

		/**
		 * Close the dialog if the target is the dialog.
		 */
		closeOverlay: withSyncEvent((e) => {
			if (e.target === e.currentTarget) {
				actions.close();
			}
		}),

		/**
		 * Handle keydown events.
		 */
		handleKeydown: withSyncEvent((event) => {
			if (state.open) {
				// Closes the lightbox when the user presses the escape key.
				if (event.key === 'Escape') {
					event.preventDefault();
					event.stopPropagation();
					actions.close();
				}
			}
		}),
	},
});

// Listen for cart toggle event.
addEventListener('scToggleCart', actions.toggle); // Listen for checkout update on product page.
