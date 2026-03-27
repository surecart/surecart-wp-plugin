/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

store('surecart/dialog', {
	actions: {
		toggle: (targetClass = null) => {
			const { target } = getContext() || {};

			// Get passed target or <dialog>.
			let dialog = document.querySelector(targetClass ?? target ?? null);

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
