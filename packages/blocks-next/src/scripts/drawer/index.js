/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

// controls the product page.
store('surecart/drawer', {
	actions: {
		toggle: (e) => {
			const context = getContext() || {};

			const dialog = e.target.dataset.Target
				? document.querySelector(e.target.dataset.Target)
				: e.target.closest('dialog');

			// Set the dialog to the context.
			context.dialog = dialog;
			context.isOpen = dialog?.open ? false : true;

			// Toggle the dialog.
			dialog?.open ? dialog?.close() : dialog?.showModal();
		},
		closeOverlay: (e) => {
			if (e.target === e.currentTarget) {
				e.currentTarget.close();
			}
		},
	},
});
