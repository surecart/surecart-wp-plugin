/**
 * WordPress dependencies.
 */
import { store, getElement, getContext, withSyncEvent } from '@wordpress/interactivity';

/**
 * Internal dependencies.
 */
import apiFetch from '@surecart/api-fetch';
import { inertEverythingExcept, removeInert } from '../utils/inert';
const { __ } = wp.i18n;
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

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

/**
 * Set focus to the first focusable element in the dialog.
 */
const setInitialFocus = () => {
	// Use requestAnimationFrame to ensure DOM is ready after state change.
	requestAnimationFrame(() => {
		const dialog = document.querySelector(
			'.wp-block-surecart-product-review-form .sc-product-review-form-dialog'
		);
		const firstFocusable = dialog?.querySelector(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		firstFocusable?.focus();
	});
};

const { state, actions, callbacks } = store('surecart/product-review-form', {
	actions: {
		/** Open product review form modal */
		open: withSyncEvent(function* (event) {
			if (!isValidEvent(event)) return;

			// prevent default to avoid page reload.
			event?.preventDefault();

			const { redirect_url, product_id } = getContext();

			// Store the button that triggered the open action for focus restoration.
			state.openButton = event?.target?.closest(
				'.wp-block-surecart-product-review-add-button'
			);

			// If redirect URL is set, redirect to it instead of opening the form
			if (redirect_url) {
				window.location.href = redirect_url;
				return;
			}

			// append the URL parameter.
			appendProductReviewFormUrlParameter(product_id);

			// open the dialog UI.
			state.open = true;

			// Announce modal open to screen readers.
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);
			speak(__('Product review form opened.', 'surecart'), 'assertive');

			// Set initial focus to the first focusable element.
			setInitialFocus();
		}),

		/** Close the product review form dialog. */
		close: withSyncEvent(function* (event) {
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

			// Announce modal close to screen readers.
			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);
			speak(__('Product review form closed.', 'surecart'), 'assertive');

			// restore focus to the open button.
			setTimeout(() => state?.openButton?.focus(), 1);
		}),

		/** Set the stars */
		setStars(event) {
			const context = getContext();
			context.stars = event?.target?.value ?? 0;
		},

		/** Handle keyboard selection of stars */
		handleStarKeydown: withSyncEvent(function(event) {
			if (event.key === ' ' || event.key === 'Enter') {
				event.preventDefault();
				actions.selectStar(event.target);
			}
		}),

		/** Handle click selection of stars */
		handleStarClick(event) {
			actions.selectStar(event.currentTarget);
		},

		/** Select a star by label element */
		selectStar(label) {
			const starValue = label.getAttribute('data-star');
			const input = document.getElementById(`stars-star${starValue}`);
			if (input) {
				input.checked = true;
				input.dispatchEvent(new Event('change', { bubbles: true }));
			}
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

		/**
		 * Handle form submit.
		 */
		handleSubmit: withSyncEvent(function* (e) {
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

				// Import speak function for screen reader announcements.
				const { speak } = yield import(
					/* webpackIgnore: true */
					'@wordpress/a11y'
				);

				if (isInvalidInput(context)) {
					return;
				}

				try {
					context.busy = true;

					// Announce submitting state to screen readers.
					speak(
						__('Submitting your review.', 'surecart'),
						'assertive'
					);

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

					// Move focus to the confirmation content for accessibility.
					requestAnimationFrame(() => {
						const confirmation = document.querySelector(
							'.sc-product-review-confirmation'
						);
						const firstFocusable = confirmation?.querySelector(
							'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
						);
						if (firstFocusable) {
							firstFocusable.focus();
						} else if (confirmation) {
							// If no focusable element, make the confirmation focusable and focus it.
							confirmation.setAttribute('tabindex', '-1');
							confirmation.focus();
						}
					});
				} catch (error) {
					console.error(error);

					let errorMessage =
						error?.message ||
						__(
							'Failed to submit review. Please try again.',
							'surecart'
						);

					// Append additional error messages if available.
					if (
						error?.additional_errors &&
						Array.isArray(error.additional_errors)
					) {
						const additionalMessages = error.additional_errors
							.map((err) => err.message)
							.join(' ');
						errorMessage += ' ' + additionalMessages;
					}

					// Show alert to user.
					// eslint-disable-next-line no-alert
					alert(errorMessage);
				} finally {
					context.busy = false;
				}
			}
		}),
	},

	callbacks: {
		/**
		 * Handle initial focus on page load when modal is opened via URL.
		 */
		handleInit() {
			if (state.open) {
				setInitialFocus();
			}
		},

		handleOpenChange() {
			if (state.open) {
				document.body.classList.add('sc-product-review-form-open');
				// Make all elements inert except the review form dialog.
				inertEverythingExcept(
					document.querySelector(
						'.wp-block-surecart-product-review-form'
					)
				);
			} else {
				document.body.classList.remove('sc-product-review-form-open');
				// Remove inert from all elements that were made inert.
				removeInert();
			}
		},

		handleKeyDown(event) {
			if (event?.key === 'Escape') {
				actions.close(event);
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
