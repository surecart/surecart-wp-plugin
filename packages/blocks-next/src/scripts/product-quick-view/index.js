/**
 * WordPress dependencies
 */
import { store, getElement, getContext } from '@wordpress/interactivity';
const { __ } = wp.i18n;

/**
 * Holds all elements that are made inert when the lightbox is open; used to
 * remove inert attribute of only those elements explicitly made inert.
 *
 * @type {Array}
 */
let inertElements = [];

const { state, actions } = store('surecart/product-quick-view', {
	state: {
		loading: false,
		open: false,
		showClosingAnimation: false,
	},

	actions: {
		/** Navigate to a URL using the router region. */
		*navigate(event) {
			state.loading = true;
			actions.toggle(event);

			const { ref } = getElement();
			const { url } = getContext();
			const routerRegion = ref.closest('[data-wp-router-region]');

			if (routerRegion) {
				event.preventDefault();
				const { actions: routerActions } = yield import(
					/* webpackIgnore: true */
					'@wordpress/interactivity-router'
				);
				yield routerActions.navigate(url, {
					replace: true,
				});
			}
			document
				.querySelector('.sc-product-quick-view-dialog__close-button')
				?.focus();
			state.loading = false;
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
		open() {
			state.open = true;
			document.body.classList.add('sc-product-quick-view-open');

			inertElements = Array.from(
				document.querySelectorAll(
					'body > :not(.sc-lightbox-overlay):not(.wp-block-surecart-product-quick-view)'
				)
			).filter((el) => !el.hasAttribute('inert'));

			inertElements.forEach((el) => el.setAttribute('inert', ''));
		},

		/** Close the product quick view dialog. */
		*close() {
			state.open = false;
			state.showClosingAnimation = true;

			document.body.classList.remove('sc-product-quick-view-open');
			yield actions.clearURLParam();

			inertElements.forEach((el) => el.removeAttribute('inert'));
			inertElements = [];
		},
		/** Toggle the dialog open/close based on keyboard event or click. */
		*toggle(e) {
			if (e?.key && ![' ', 'Enter'].includes(e.key)) return;
			e?.preventDefault();

			if (state.open) {
				yield actions.close();
			} else {
				actions.open();
			}
		},
		*handleKeyDown(e) {
			if (e?.key && e.key !== 'Escape') return;
			yield actions.close();
		},
		/** Close if clicked outside the dialog content. */
		closeOverlay(e) {
			if (e.target === e.currentTarget) actions.close();
		},

		/** Clear product quick view URL param. */
		*clearURLParam() {
			state.loading = true;

			const url = new URL(window.location.href);
			url.searchParams.delete('product-quick-view-id');

			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);
			yield routerActions.navigate(url.toString(), { replace: true });
			state.loading = false;
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
