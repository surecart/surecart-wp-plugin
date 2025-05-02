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
 * Tracks elements made inert when lightbox is active.
 * Helps revert only explicitly modified elements.
 *
 * @type {Array<HTMLElement>}
 */
let inertElements = [];

/**
 * Validate if the event triggers an open/close action.
 *
 * @param {Event} event
 * @returns {boolean}
 */
const isValidEvent = (event) =>
	event?.key ? [' ', 'Enter'].includes(event.key) : true;

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		loading: false,
		open: false,
		showClosingAnimation: false,
	},

	actions: {
		/** Navigate using interactivity router */
		*navigate(event) {
			const { ref } = getElement();
			const { url } = getContext();
			const routerRegion = ref.closest('[data-wp-router-region]');
			if (!routerRegion) return;

			event?.preventDefault();

			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);

			yield routerActions.navigate(url, { replace: true });
		},

		/** Prefetch URL */
		*prefetch() {
			const { url } = getContext();
			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			yield routerActions.prefetch(url);
		},

		/** Open quick view modal */
		*open(event) {
			event?.preventDefault();
			if (!isValidEvent(event)) return;

			state.loading = true;
			state.open = true;
			document.body.classList.add('sc-product-quick-view-open');

			// Set inert on all siblings
			inertElements = Array.from(
				document.querySelectorAll(
					'body > :not(.sc-lightbox-overlay):not(.wp-block-surecart-product-quick-view)'
				)
			).filter((el) => !el.hasAttribute('inert'));

			inertElements.forEach((el) => el.setAttribute('inert', ''));

			if (event) yield actions.navigate(event);
			state.loading = false;

			document
				.querySelector('.sc-product-quick-view-dialog__close-button')
				?.focus();
		},

		/** Close the product quick view dialog. */
		*close(event) {
			if (!state.open || !isValidEvent(event)) return;

			const { ref } = getElement();
			const dialog = ref?.closest('.sc-product-quick-view-dialog');

			dialog.addEventListener(
				'transitionend',
				withScope(() => {
					state.showClosingAnimation = false;
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
		},
	},

	callbacks: {
		init() {
			if (!state.open) {
				actions.open(); // Trigger open if URL param exists
			}
		},
	},
});
