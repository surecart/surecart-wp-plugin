/**
 * WordPress dependencies
 */
import { store, getElement } from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * Holds all elements that are made inert when the lightbox is open; used to
 * remove inert attribute of only those elements explicitly made inert.
 *
 * @type {Array}
 */
let inertElements = [];

const { state, actions } = store('surecart/sidebar', {
	state: {
		mobileOpen: false,
		/**
		 * The sidebar dialog element.
		 * This gets cached so we can call this many times without querying the DOM.
		 */
		get dialog() {
			let dialog = document?.querySelector('.sc-sidebar-drawer') || null;

			if (!dialog) {
				const { ref } = getElement();

				dialog =
					ref.parentElement.querySelector('.sc-sidebar-drawer') || // Sibling sc-sidebar-drawer.
					ref.closest('.sc-sidebar-drawer') || // Parent sc-sidebar-drawer.
					null;
			}

			return dialog;
		},
		get ariaLabelDesktop() {
			return state?.open
				? __('Close sidebar', 'surecart')
				: __('Open sidebar', 'surecart');
		},
		ariaLabelMobile: __('Open sidebar', 'surecart'),
	},

	actions: {
		/**
		 * Open the sidebar dialog.
		 */
		open: function* () {
			state.mobileOpen = true;
			// also do not add inert for the parent of the current element
			actions.inertEverythingExcept(
				document.querySelector('.sc-sidebar-drawer')
			);
			state.ariaLabelMobile = __('Close sidebar', 'surecart');
		},

		/**
		 * Close the sidebar dialog.
		 */
		close: () => {
			state.mobileOpen = false;
			// remove inert attribute from all elements that were made inert
			inertElements.forEach((el) => {
				el.removeAttribute('inert');
			});
			inertElements = [];
			state.ariaLabelMobile = __('Open sidebar', 'surecart');
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

			state?.mobileOpen ? actions.close() : actions.open();
		},

		/**
		 * Close the dialog if the target is the dialog.
		 */
		closeOverlay: (e) => {
			// If the target is the dialog, close it.
			if (e.target === e.currentTarget) {
				actions.close();
			}
		},
		/**
		 * Make all children of the document inert exempt the current element.
		 */
		inertEverythingExcept: (element) => {
			let current = element;

			while (current && current !== document?.body) {
				const parent = current?.parentElement;
				if (!parent) break;

				Array.from(parent?.children)?.forEach((sibling) => {
					if (
						sibling !== current &&
						!sibling?.hasAttribute('inert')
					) {
						sibling?.setAttribute('inert', '');
						inertElements?.push(sibling);
					}
				});

				current = parent;
			}
		},
	},
});
