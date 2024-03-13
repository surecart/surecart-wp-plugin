/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

// controls the product page.
store('surecart/dialog', {
	callbacks: {
		toggle: (e) => {
			const dialog = e.target.dataset.target
				? document.querySelector(e.target.dataset.target)
				: e.target.closest('dialog');
			dialog.open ? dialog.close() : dialog.showModal();
		},
		closeOverlay: (e) => {
			if (e.target === e.currentTarget) {
				e.currentTarget.close();
			}
		},
		actions: {
			toggle: (target) => {
				target.open ? target.close() : target.showModal();
			},
		},
	},
});
