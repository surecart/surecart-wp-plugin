/**
 * WordPress dependencies
 */
import {
	store,
	getElement,
	getContext,
	withScope,
} from '@wordpress/interactivity';

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
	event?.key ? [' ', 'Enter', 'Escape'].includes(event.key) : true;

const { state, actions } = store('surecart/product-quick-view', {
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
			if (!isValidEvent(event)) return;

			// prevent default to avoid page reload.
			event?.preventDefault();

			// import lightbox and image slider scripts modules.
			yield import(/* webpackIgnore: true */ 'surecart/lightbox');
			yield import(/* webpackIgnore: true */ '@surecart/image-slider');

			// open the dialog UI.
			state.open = true;

			// navigate to the product page.
			if (event) yield actions.navigate(event);

			// focus the first focusable element.
			const firstFocusable = document
				.querySelector('.sc-product-quick-view-dialog')
				?.querySelector(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
			firstFocusable?.focus();
		},

		/** Close the product quick view dialog. */
		*close(event) {
			if (!state.open || !isValidEvent(event)) return;

			// prevent default to avoid page reload.
			event?.preventDefault();

			const { ref } = getElement();
			const dialog = ref
				?.closest('.wp-block-surecart-product-quick-view')
				.querySelector('.sc-product-quick-view-dialog');

			dialog.addEventListener(
				'transitionend',
				withScope(() => {
					actions.navigate(event);
				}),
				{ once: true }
			); // Wait for the closing animation to finish before navigating.

			state.open = false;
		},
	},

	callbacks: {
		handleOpenChange() {
			if (!inertElements.length) {
				inertElements = Array.from(
					document.querySelectorAll(
						'body > :not(.sc-lightbox-overlay):not(.wp-block-surecart-product-quick-view)'
					)
				).filter((el) => !el.hasAttribute('inert'));
			}

			if (state.open) {
				document.body.classList.add('sc-product-quick-view-open');
				inertElements.forEach((el) => el.setAttribute('inert', ''));
			} else {
				document.body.classList.remove('sc-product-quick-view-open');
				inertElements.forEach((el) => el.removeAttribute('inert'));
			}
		},
		handleKeyDown(event) {
			if (event?.key === 'Escape') {
				actions.close(event);
			}
		},
	},
});
