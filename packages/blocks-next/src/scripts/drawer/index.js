/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

// controls the product page.
store('surecart/drawer', {
	actions: {
		toggle: (e) => {
			const dialog = e.target.dataset.Target
				? document.querySelector(e.target.dataset.Target)
				: e.target.closest('dialog');

			dialog?.open ? dialog?.close() : dialog?.showModal();

			// Lock the body scroll when the dialog is open.
			if (dialog?.open) {
				document.body.classList.add('sc-scroll-lock');
			} else {
				document.body.classList.remove('sc-scroll-lock');
			}
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
