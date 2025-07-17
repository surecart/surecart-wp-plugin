/**
 * WordPress dependencies
 */
import { store, getElement } from '@wordpress/interactivity';
const { state: checkoutState, actions: checkoutActions } =
	store('surecart/checkout');
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

		/**
		 * Get all focusable elements within the cart dialog.
		 */
		get focusableElements() {
			const dialog = state.dialog;
			if (!dialog) return [];

			const focusableSelectors = [
				'button:not([disabled])',
				'[href]',
				'input:not([disabled])',
				'select:not([disabled])',
				'textarea:not([disabled])',
				'[tabindex]:not([tabindex="-1"])',
				'[contenteditable="true"]'
			].join(', ');

			return Array.from(dialog.querySelectorAll(focusableSelectors));
		},

		/**
		 * Get the first focusable element in the cart dialog.
		 */
		get firstFocusableElement() {
			const elements = state.focusableElements;
			return elements.length > 0 ? elements[0] : null;
		},

		/**
		 * Get the last focusable element in the cart dialog.
		 */
		get lastFocusableElement() {
			const elements = state.focusableElements;
			return elements.length > 0 ? elements[elements.length - 1] : null;
		},
	},

	actions: {
		/**
		 * Handle focus trapping within the cart dialog.
		 */
		trapFocus(e) {
			if (!state.dialog || !state.dialog.open) return;

			// Handle Tab key navigation
			if (e.key === 'Tab') {
				const firstElement = state.firstFocusableElement;
				const lastElement = state.lastFocusableElement;

				if (!firstElement || !lastElement) return;

				// Shift + Tab: moving backwards
				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					// Tab: moving forwards
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}

			// Handle Escape key to close cart
			if (e.key === 'Escape') {
				e.preventDefault();
				actions.close();
			}
		},

		/**
		 * Open the cart dialog.
		 */
		open() {
			state.dialog?.showModal();
			// speak the cart dialog state.
			state.label = __('Cart opened.', 'surecart');

			// fetch the checkout.
			checkoutActions.fetch();

			// Trigger cart view event.
			actions.processCartViewEvent(checkoutState?.checkout);

			// Set up focus trapping
			document.addEventListener('keydown', actions.trapFocus);

			// Focus the first focusable element
			setTimeout(() => {
				state.firstFocusableElement?.focus();
			}, 0);
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
			state.dialog?.close();
			state.label = __('Cart closed.', 'surecart');

			// Remove focus trapping
			document.removeEventListener('keydown', actions.trapFocus);

			// Return focus to the cart toggle button
			const cartToggleButton = document.querySelector('[data-wp-on--click="surecart/cart::actions.toggle"]');
			if (cartToggleButton) {
				cartToggleButton.focus();
			}
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
			const isOpen = state?.dialog?.open;
			if (isOpen) {
				actions.close();
			} else {
				actions.open();
			}
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
