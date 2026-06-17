/**
 * WordPress dependencies
 */
import { store, getElement, withSyncEvent } from '@wordpress/interactivity';
import { inertEverythingExcept, removeInert } from '../utils/inert';
const { __ } = wp.i18n;

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
				? __('Hide filters', 'surecart')
				: __('Show filters', 'surecart');
		},
		ariaLabelMobile: __('Show filters', 'surecart'),
	},

	actions: {
		/**
		 * Open the sidebar dialog.
		 */
		open: function* () {
			state.mobileOpen = true;
			// also do not add inert for the parent of the current element
			inertEverythingExcept(document.querySelector('.sc-sidebar-drawer'));
			state.ariaLabelMobile = __('Close sidebar', 'surecart');
		},

		/**
		 * Close the sidebar dialog.
		 */
		close: () => {
			state.mobileOpen = false;
			// remove inert attribute from all elements that were made inert
			removeInert();
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
		toggleDesktop: withSyncEvent((e) => {
			// If the key is not space or enter, return.
			if (e?.key && e?.key !== ' ' && e?.key !== 'Enter') {
				return;
			}

			// Prevent default behavior.
			e?.preventDefault();

			state.open = !state.open;
		}),

		/**
		 * Toggle the sidebar dialog.
		 */
		toggleMobile: withSyncEvent((e) => {
			// If the key is not space or enter, return.
			if (e?.key && e?.key !== ' ' && e?.key !== 'Enter') {
				return;
			}

			// Prevent default behavior.
			e?.preventDefault();

			state?.mobileOpen ? actions.close() : actions.open();
		}),

		/**
		 * Close the dialog if the target is the dialog.
		 */
		closeOverlay: withSyncEvent((e) => {
			// If the target is the dialog, close it.
			if (e.target === e.currentTarget) {
				actions.close();
			}
		}),

		/**
		 * Close the mobile drawer once the viewport grows to desktop width (≥ 780px).
		 *
		 * Gating on width ignores Android keyboard resizes (height-only) that would otherwise close it.
		 */
		handleResize: withSyncEvent(() => {
			if (state.mobileOpen && window.innerWidth >= 780) {
				actions.close();
			}
		}),

		/**
		 * Handle keydown events.
		 */
		handleKeydown: withSyncEvent((event) => {
			if (state.mobileOpen) {
				if (event.key === 'Escape') {
					event.preventDefault();
					event.stopPropagation();
					actions.close();
				}
			}
		}),
	},
});
