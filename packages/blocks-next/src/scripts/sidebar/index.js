/**
 * WordPress dependencies
 */
import { store, getElement } from '@wordpress/interactivity';
const { __ } = wp.i18n;

const { state, actions } = store('surecart/sidebar', {
	state: {
		/**
		 * The sidebar dialog element.
		 * This gets cached so we can call this many times without querying the DOM.
		 */
		get dialog() {
			let dialog = document?.querySelector('.sc-sidebar-drawer') || null;

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
	},

	actions: {
		/**
		 * Open the sidebar dialog.
		 */
		open: function* () {
			state.dialog?.showModal();
		},

		/**
		 * Close the sidebar dialog.
		 */
		close: () => {
			state.dialog?.close();
		},

		/**
		 * Close the desktop sidebar.
		 */
		closeDesktop: () => {
			state.open = false;
		},

		/**
		 * Open the desktop sidebar.
		 */
		openDesktop: () => {
			state.open = true;
		},

		/**
		 * Toggle the sidebar dialog.
		 * This is used for the desktop sidebar.
		 */
		toggleDesktop: (e) => {
			// If the key is not space or enter, return.
			if (e?.key && e?.key !== ' ' && e?.key !== 'Enter') {
				return;
			}

			// Prevent default behavior.
			e?.preventDefault();

			state.open = !state.open;
		},

		/**
		 * Toggle the sidebar dialog.
		 */
		toggleMobile: (e) => {
			// If the key is not space or enter, return.
			if (e?.key && e?.key !== ' ' && e?.key !== 'Enter') {
				return;
			}

			// Prevent default behavior.
			e?.preventDefault();

			state?.dialog?.open ? actions.close() : actions.open();
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

// Listen for sidebar toggle event.
addEventListener('scToggleSidebar', actions.toggle); // Listen for checkout update on product page.
