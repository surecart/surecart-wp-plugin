/**
 * WordPress dependencies.
 */
import { store, getElement, getContext } from '@wordpress/interactivity';

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
 */
const isValidEvent = (event) =>
	event?.key ? [' ', 'Enter', 'Escape'].includes(event.key) : true;

/**
 * Validate the review input.
 */
const isInvalidInput = (context) => {
	const { stars, title, sc_product_id } = context;

	return (
		!stars ||
		stars < 1 ||
		stars > 5 ||
		!title ||
		title?.trim() === '' ||
		!sc_product_id
	);
};

/**
 * Check if the form has unsaved changes.
 */
const hasUnsavedChanges = (context) => {
	const { stars, title, body } = context;
	return (
		stars > 0 ||
		(title && title.trim() !== '') ||
		(body && body.trim() !== '')
	);
};

/**
 * Remove the product-review-form URL parameter.
 */
const removeProductReviewFormUrlParameter = () => {
	const url = new URL(window.location.href);
	url.searchParams.delete('product-review-form');
	window.history.pushState({}, '', url.toString());
};

/**
 * Append the product-review-form URL parameter.
 */
const appendProductReviewFormUrlParameter = (productId) => {
	const url = new URL(window.location.href);
	url.searchParams.set('product-review-form', productId);
	window.history.pushState({}, '', url.toString());
};

const { state, actions, callbacks } = store('surecart/product-review-form', {
	actions: {
		/** Open product review form modal */
		*open(event) {
			if (!isValidEvent(event)) return;

			// prevent default to avoid page reload.
			event?.preventDefault();

			const { redirect_url, product_id } = getContext();

			// If redirect URL is set, redirect to it instead of opening the form
			if (redirect_url) {
				window.location.href = redirect_url;
				return;
			}

			// append the URL parameter.
			appendProductReviewFormUrlParameter(product_id);

			// open the dialog UI.
			state.open = true;
		},

		/** Close the product review form dialog. */
		*close(event) {
			if (!state.open || !isValidEvent(event)) return;
			const context = getContext();

			// prevent default to avoid page reload.
			event?.preventDefault();

			// Confirm before closing if there are unsaved changes.
			if (hasUnsavedChanges(context)) {
				// eslint-disable-next-line no-alert
				if (!window.confirm(__('Discard your review?', 'surecart'))) {
					return;
				}
			}

			// Clear the form when closing.
			callbacks.clearForm();

			// close the dialog UI and reset submitted state.
			state.open = false;
			context.submitted = false;
			removeProductReviewFormUrlParameter();

			// restore focus to the open button.
			setTimeout(() => state?.openButton?.focus(), 1);
		},

		/** Set the stars */
		setStars(event) {
			const context = getContext();
			context.stars = event?.target?.value ?? 0;
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

			// if the button does not have a value, it's the main submit button.
			if (!e?.submitter?.value) {
				const context = getContext();
				const { stars, title, sc_product_id, body } = context;

				if (isInvalidInput(context)) {
					return;
				}

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

					if (!response || !response?.id) {
						throw new Error(
							__(
								'Failed to submit review, please try again.',
								'surecart'
							)
						);
					}

					callbacks.clearForm();
					context.submitted = true;
				} catch (e) {
					console.error(e);
				} finally {
					context.busy = false;
				}
			}
		},

		/**
		 * Clear the form fields.
		 */
		clearForm() {
			const context = getContext();

			// Reset all form fields.
			context.stars = 0;
			context.title = '';
			context.body = '';

			// Manually uncheck the radio buttons.
			const radioButtons = document.querySelectorAll(
				'.wp-block-surecart-product-review-form-rating input[type="radio"][name="stars"]'
			);

			radioButtons.forEach((radio) => {
				radio.checked = false;
			});
		},
	},
});
