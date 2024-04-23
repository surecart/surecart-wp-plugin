/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

// controls the product page.
store('surecart/dialog', {
	actions: {
		toggle: () => {
			const { target } = getContext() || {};
			const { ref } = getElement();

			// get passed target or any <dialog> sibling.
			let dialog =
				document.querySelector(target ?? null) || // specified target
				ref.parentElement.querySelector('dialog') || // sibling dialog
				ref.closest('dialog') || // parent dialog
				null;

			// If no dialog is found, search for the closest dialog.
			if (!dialog) {
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
