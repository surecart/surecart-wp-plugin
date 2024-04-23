/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

// controls the product page.
store('surecart/dialog', {
	actions: {
		toggle: () => {
			const { drawerTarget } = getContext() || {};
			const { ref } = getElement();

			// get passed target or any <dialog> sibling.
			let dialog = drawerTarget
				? document.querySelector(drawerTarget)
				: ref.parentElement.querySelector('dialog');

			// If no dialog is found, search for the closest dialog.
			if (!dialog) {
				dialog = ref.closest('dialog') || null;
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
