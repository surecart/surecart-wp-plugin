/**
 * WordPress dependencies
 */
import {
	store,
	getElement,
	getContext,
	withScope,
} from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * Holds all elements that are made inert when the lightbox is open; used to
 * remove inert attribute of only those elements explicitly made inert.
 *
 * @type {Array}
 */
let inertElements = [];

/**
 * Check if the event is valid for opening/closing the dialog.
 *
 * @param {Event} event - The event to check.
 * @returns {boolean} - Returns true if the event is valid, false otherwise.
 * */
const isValidEvent = (event) => {
	if (event?.key && ![' ', 'Enter'].includes(event.key)) return false;

	return true;
};

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		loading: false,
		open: false,
		showClosingAnimation: false,
	},

	actions: {
		/** Navigate to a URL using the router region. */
		*navigate(event) {
			const { ref } = getElement();
			const { url } = getContext();
			const routerRegion = ref.closest('[data-wp-router-region]');
			if (routerRegion) {
				event?.preventDefault();
				const { actions: routerActions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield routerActions.navigate(url, {
					replace: true,
				});
			}
		},

		/** Prefetch upcoming URLs. */
		*prefetch() {
			const { url } = getContext();
			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			yield routerActions.prefetch(url);
		},

		/** Open the product quick view dialog. */
		*open(event) {
			event?.preventDefault();

			if (!isValidEvent(event)) return;

			state.loading = true;
			state.open = true;
			document.body.classList.add('sc-product-quick-view-open');

			inertElements = Array.from(
				document.querySelectorAll(
					'body > :not(.sc-lightbox-overlay):not(.wp-block-surecart-product-quick-view)'
				)
			).filter((el) => !el.hasAttribute('inert'));

			inertElements.forEach((el) => el.setAttribute('inert', ''));

			if (event) {
				yield actions.navigate(event);
			}
			state.loading = false;

			document
				.querySelector('.sc-product-quick-view-dialog__close-button')
				?.focus();
		},

		/** Close the product quick view dialog. */
		*close(event) {
			if (!state.open) return;
			if (!isValidEvent(event)) return;
			const { ref } = getElement();

			const dialog = ref?.closest('.sc-product-quick-view-dialog');

			dialog.addEventListener(
				'transitionend',
				withScope(() => {
					actions.navigate(event);
				}),
				{ once: true }
			); // Wait for the closing animation to finish before navigating.

			event?.preventDefault();
			state.showClosingAnimation = true;

			document.body.classList.remove('sc-product-quick-view-open');

			inertElements.forEach((el) => el.removeAttribute('inert'));
			inertElements = [];

			state.open = false;

			state.showClosingAnimation = false;
		},
	},

	callbacks: {
		init() {
			if (!state.open) {
				actions.open(); // Automatically opens if URL param exists
			}
		},
	},
});
