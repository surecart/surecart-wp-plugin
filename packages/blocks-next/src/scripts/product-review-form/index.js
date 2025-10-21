/**
 * WordPress dependencies.
 */
import {
	store,
	getElement,
	getContext,
	withScope,
} from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import apiFetch from '@surecart/api-fetch';
const { __ } = wp.i18n;
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

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

const { state, actions } = store('surecart/product-review-form', {
	actions: {
		/** Browser Navigate */
		*navigate(event) {
			const { product_id } = getContext();
			event?.preventDefault();

			state.loading = true;

			// Append the URL parameter.
			if (!!product_id) {
				const url = new URL(window.location.href);
				url.searchParams.set('product-review-form', product_id);
				window.history.pushState({}, '', url.toString());
			}

			state.loading = false;
		},

		/** Open review form modal */
		*open(event) {
			if (!isValidEvent(event)) return;

			// prevent default to avoid page reload.
			event?.preventDefault();

			const context = getContext();

			// If redirect URL is set, redirect to it instead of opening the form
			if (context.redirect_url) {
				window.location.href = context.redirect_url;
				return;
			}

			state.openButton = event?.target?.closest(
				'.wp-block-surecart-product-review-add-button'
			);

			// navigate to the product page.
			if (event) yield actions.navigate(event);

			// open the dialog UI.
			state.open = true;

			// focus the first focusable element.
			const firstFocusable = document
				.querySelector('.wp-block-surecart-product-review-form')
				?.querySelector(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
			firstFocusable?.focus();
		},

		/** Close the product review form dialog. */
		*close(event) {
			if (!state.open || !isValidEvent(event)) return;
			const context = getContext();

			// prevent default to avoid page reload.
			event?.preventDefault();

			// Clear the form when closing.
			actions.clearForm();

			const { ref } = getElement();
			const dialog = ref?.closest(
				'.wp-block-surecart-product-review-form'
			);

			const handleTransitionEnd = withScope((event) => {
				const isTransitioning = dialog?.getAnimations()?.length > 0;
				if (isTransitioning) return; // Wait for the transition to finish.
				// navigate to the product page.

				actions.navigate(event);
				// remove the event listener to avoid memory leaks.
				dialog.removeEventListener(
					'transitionend',
					handleTransitionEnd
				);
			});

			dialog.addEventListener('transitionend', handleTransitionEnd); // Wait for the closing animation to finish before navigating.

			state.open = false;
			context.submitted = false;

			// Remove product_id from URL.
			const url = new URL(window.location.href);
			url.searchParams.delete('product-review-form');
			window.history.pushState({}, '', url.toString());

			setTimeout(() => state?.openButton?.focus(), 1);
		},

		/** Set the selected stars */
		setStars() {
			const { ref } = getElement();
			const stars = parseInt(ref.dataset.stars || ref.value);
			const context = getContext();

			// Set the actual stars.
			context.stars = stars;
		},

		/** Clear all form data */
		clearForm() {
			const context = getContext();

			// Reset all form fields.
			context.stars = 0;
			context.title = '';
			context.content = '';
		},

		/** Set the review title */
		setTitle(event) {
			const context = getContext();
			context.title = event?.target?.value ?? '';
		},

		/** Set the review content */
		setContent(event) {
			const context = getContext();
			context.body = event?.target?.value ?? '';
		},
	},

	callbacks: {
		handleOpenChange() {
			if (!inertElements.length) {
				inertElements = Array.from(
					document.querySelectorAll(
						'body > :not(.sc-lightbox-overlay):not(.wp-block-surecart-product-review-form)'
					)
				).filter((el) => !el.hasAttribute('inert'));
			}

			if (state.open) {
				document.body.classList.add('sc-product-review-form-open');
				inertElements.forEach((el) => el.setAttribute('inert', ''));
			} else {
				document.body.classList.remove('sc-product-review-form-open');
				inertElements.forEach((el) => el.removeAttribute('inert'));
			}
		},

		handleKeyDown(event) {
			if (event?.key === 'Escape') {
				actions.close(event);
			}
		},

		/**
		 * Handle submit callback.
		 */
		*handleSubmit(e) {
			if (e.type === 'keydown' && e.key !== 'Enter') {
				return true;
			}

			e.preventDefault(); // prevent the form from submitting.
			e.stopPropagation(); // prevent the event from bubbling up.

			// Add submitter to event if it doesn't exist (for non-form elements)
			if (!e.submitter) {
				const { ref } = getElement();
				if (ref) {
					e.submitter = ref;
				}
			}

			// if the button does not have a value, add to cart.
			if (!e?.submitter?.value) {
				const context = getContext();
				const { stars, title, body, sc_product_id } = context;
				try {
					context.busy = true;

					// Submit the review via REST API.
					const response = yield apiFetch({
						method: 'POST',
						path: addQueryArgs('/surecart/v1/reviews'),
						data: {
							product: sc_product_id,
							stars,
							title,
							body,
						},
					});

					if (!response || !response.id) {
						throw new Error(__('Submission failed', 'surecart'));
					}

					context.submitted = true;
				} catch (e) {
					console.error(e);
				} finally {
					context.busy = false;
				}
			}
		},
	},
});
