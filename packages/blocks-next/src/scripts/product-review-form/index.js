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
	state: {
		open: false,
		loading: false,
		openButton: null,
		get isStarFilled() {
			const context = getContext();
			const element = getElement();
			const starNumber = parseInt(element.ref.dataset.rating);
			const currentRating = context.stars || 0;
			const currentHoverRating = context.hoverRating || 0;

			// Show filled if star number is <= hover rating (when hovering) or <= actual rating.
			return starNumber <= (currentHoverRating || currentRating);
		},
	},

	actions: {
		/** Navigate using interactivity router */
		*navigate(event) {
			const { product_id } = getContext();
			event?.preventDefault();

			state.loading = true;

			// just append the URL parameter for now.
			if (!!product_id) {
				const url = new URL(window.location.href);
				url.searchParams.set('product-review-form', product_id);
				window.history.pushState({}, '', url.toString());
			}

			state.loading = false;
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

		/** Open review form modal */
		*open(event) {
			if (!isValidEvent(event)) return;

			// prevent default to avoid page reload.
			event?.preventDefault();

			state.openButton = event?.target?.closest(
				'.wp-block-surecart-review-add-button'
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

			// prevent default to avoid page reload.
			event?.preventDefault();

			// Clear the form when closing
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
				//remove the event listener to avoid memory leaks.
				dialog.removeEventListener(
					'transitionend',
					handleTransitionEnd
				);
			});

			dialog.addEventListener('transitionend', handleTransitionEnd); // Wait for the closing animation to finish before navigating.

			state.open = false;

			// Remove product_id from URL.
			const url = new URL(window.location.href);
			url.searchParams.delete('product-review-form');
			window.history.pushState({}, '', url.toString());

			setTimeout(() => state?.openButton?.focus(), 1);
		},

		/** Set the hover rating for visual feedback */
		setHoverRating() {
			const { ref } = getElement();
			const rating = parseInt(ref.dataset.rating);
			const context = getContext();

			// Set hover rating for immediate visual feedback
			context.hoverRating = rating;

			// Update all stars in the container to show hover state
			const container = ref.closest(
				'.wp-block-surecart-product-review-form-rating'
			);
			if (container) {
				const stars = container.querySelectorAll('.star-button');
				stars.forEach((star, index) => {
					const starNumber = index + 1;
					if (starNumber <= rating) {
						star.style.color = 'var(--sc-color-primary-500)';
					}
				});
			}
		},

		/** Clear the hover rating */
		clearHoverRating() {
			const context = getContext();
			const { ref } = getElement();

			// Clear hover rating to show actual selected rating
			context.hoverRating = 0;

			// Reset all stars to show actual rating state
			const container = ref.closest(
				'.wp-block-surecart-product-review-form-rating'
			);
			if (container) {
				const stars = container.querySelectorAll('.star-button');
				const actualRating = context.rating || 0;
				stars.forEach((star, index) => {
					const starNumber = index + 1;
					if (starNumber <= actualRating) {
						star.style.color = 'var(--sc-color-primary-500)';
					}
				});
			}
		},

		/** Set the selected stars */
		setStars() {
			const { ref } = getElement();
			const rating = parseInt(ref.dataset.rating);
			const context = getContext();

			// Set the actual rating and clear hover state.
			context.stars = rating;
			context.hoverRating = 0;

			// Update all stars to show selected state.
			const container = ref.closest(
				'.wp-block-surecart-product-review-form-rating'
			);

			if (container) {
				const stars = container.querySelectorAll('.star-button');
				stars.forEach((star, index) => {
					const starNumber = index + 1;
					if (starNumber <= rating) {
						star.style.color = 'var(--sc-color-primary-500)';
						// Add animation to the clicked star
						if (starNumber === rating) {
							star.classList.add('filled');
							setTimeout(() => {
								star.classList.remove('filled');
							}, 250);
						}
					}
				});
			}
		},

		/** Clear all form data - reset rating and any other form fields */
		clearForm() {
			const context = getContext();

			// Reset rating and hover state
			context.rating = 0;
			context.hoverRating = 0;

			// Reset title and content
			context.title = '';
			context.content = '';

			// Clear visual state of all stars
			const formContainer = document.querySelector(
				'.wp-block-surecart-product-review-form'
			);
			if (formContainer) {
				// Reset all stars
				const stars = formContainer.querySelectorAll('.star-button');
				stars.forEach((star) => {
					star.style.color = '';
					star.classList.remove('filled');
				});

				// Clear any text inputs
				const textInputs = formContainer.querySelectorAll(
					'input[type="text"], input[type="email"], textarea'
				);
				textInputs.forEach((input) => {
					input.value = '';
				});

				// Clear hidden rating input
				const hiddenRatingInput = formContainer.querySelector(
					'input[name="rating"]'
				);
				if (hiddenRatingInput) {
					hiddenRatingInput.value = '';
				}

				// Clear any other form inputs
				const otherInputs = formContainer.querySelectorAll(
					'input:not([type="submit"]):not([type="button"]):not([type="hidden"])'
				);
				otherInputs.forEach((input) => {
					if (input.type === 'checkbox' || input.type === 'radio') {
						input.checked = false;
					} else {
						input.value = '';
					}
				});

				// Clear any select elements
				const selects = formContainer.querySelectorAll('select');
				selects.forEach((select) => {
					select.selectedIndex = 0;
				});
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

		/** Update the hidden input value when rating changes */
		updateRatingValue() {
			const { ref } = getElement();
			const { rating } = getContext();
			const hiddenInput = ref.querySelector('input[name="rating"]');
			if (hiddenInput) {
				hiddenInput.value = rating;
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

					// Handle success - close the form and maybe show a success message
					alert('Thank you for your review!');
					actions.close();
				} catch (e) {
					console.error(e);
				} finally {
					context.busy = false;
				}
			}
		},

		init() {
			// Ensure the inert state is correct on init.
			console.log('init called');
		},
	},
});
