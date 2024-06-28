/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
const { __ } = wp.i18n;
const { speak } = wp.a11y;

store('surecart/cart-drawer', {
	actions: {
		toggle: () => {
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

			// speak the cart dialog state.
			dialog?.open
				? dialog?.setAttribute('aria-live', 'assertive')
				: dialog?.removeAttribute('aria-live');
			speak(
				dialog?.open
					? __('Cart opened', 'surecart')
					: __('Cart closed', 'surecart')
			);

			// If the dialog is open, close it. Otherwise, open it.
			dialog?.open ? dialog?.close() : dialog?.showModal();

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
