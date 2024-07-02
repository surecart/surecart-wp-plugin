/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
import { processCartViewEvent } from '@surecart/checkout-events';
const { state: checkoutState } = store('surecart/checkout');
const { __ } = wp.i18n;
const { speak } = wp.a11y;

store('surecart/cart', {
	actions: {
		toggle: (e) => {
			if (e && e.key === 'Tab') {
				return;
			}

			e?.preventDefault();
			let dialog = null;
			const target = getContext()?.target || '.sc-drawer' || null;

			// Get passed target or <dialog>.
			if (typeof target === 'string') {
				dialog = document?.querySelector(target) || null;
			}

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

			// If the dialog is open, close it. Otherwise, open it.
			if (dialog?.open) {
				dialog?.close();

				// speak the cart dialog state.
				speak(__('Cart closed', 'surecart'), 'assertive');
			} else {
				dialog?.showModal();

				// Trigger cart view event.
				processCartViewEvent(checkoutState?.checkout);

				// speak the cart dialog state.
				speak(__('Cart opened', 'surecart'), 'assertive');
			}

			// Lock the body scroll when the dialog is open.
			dialog?.open
				? document.body.classList.add('sc-scroll-lock')
				: document.body.classList.remove('sc-scroll-lock');
		},
		closeOverlay: (e) => {
			// If the target is the dialog, close it.
			if (e.target === e.currentTarget) {
				e.currentTarget.close();
				document.body.classList.remove('sc-scroll-lock');
			}
		},
	},
});
