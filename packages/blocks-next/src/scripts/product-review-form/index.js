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

const { state, actions } = store('surecart/product-review-form', {
	state: {
		open: false,
		loading: false,
		openButton: null,
		get isStarFilled() {
			const context = getContext();
			const element = getElement();
			const starNumber = parseInt(element.ref.dataset.rating);
			const currentRating = context.rating || 0;
			const currentHoverRating = context.hoverRating || 0;
			
			// Show filled if star number is <= hover rating (when hovering) or <= actual rating
			return starNumber <= (currentHoverRating || currentRating);
		},
	},

	actions: {
		/** Navigate using interactivity router */
		*navigate(event) {
			const { url } = getContext();

			event?.preventDefault();

			state.loading = true;

			const { actions: routerActions } = yield import(
				/* webpackIgnore: true */
				'@wordpress/interactivity-router'
			);

			yield routerActions.navigate(url, { replace: true });

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
			const container = ref.closest('.wp-block-surecart-product-review-form-rating');
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
			const container = ref.closest('.wp-block-surecart-product-review-form-rating');
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

		/** Set the selected rating */
		setRating() {
			const { ref } = getElement();
			const rating = parseInt(ref.dataset.rating);
			const context = getContext();
			
			// Set the actual rating and clear hover state
			context.rating = rating;
			context.hoverRating = 0;

			// Update all stars to show selected state
			const container = ref.closest('.wp-block-surecart-product-review-form-rating');
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

			// Dispatch custom event for form integration
			const event = new CustomEvent('surecart:rating-changed', {
				detail: { rating },
				bubbles: true,
				cancelable: false
			});
			
			// Dispatch from the container element
			if (container) {
				container.dispatchEvent(event);
			} else {
				ref.dispatchEvent(event);
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
			const formContainer = document.querySelector('.wp-block-surecart-product-review-form');
			if (formContainer) {
				// Reset all stars
				const stars = formContainer.querySelectorAll('.star-button');
				stars.forEach((star) => {
					star.style.color = '';
					star.classList.remove('filled');
				});

				// Clear any text inputs
				const textInputs = formContainer.querySelectorAll('input[type="text"], input[type="email"], textarea');
				textInputs.forEach((input) => {
					input.value = '';
				});

				// Clear hidden rating input
				const hiddenRatingInput = formContainer.querySelector('input[name="rating"]');
				if (hiddenRatingInput) {
					hiddenRatingInput.value = '';
				}

				// Clear any other form inputs
				const otherInputs = formContainer.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"])');
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
			const { target } = event;
			
			// Update the title in context
			context.title = target.value;
			
			// Dispatch custom event for form integration
			const customEvent = new CustomEvent('surecart:title-changed', {
				detail: { title: target.value },
				bubbles: true,
				cancelable: false
			});
			
			target.dispatchEvent(customEvent);
		},

		/** Set the review content */
		setContent(event) {
			const context = getContext();
			const { target } = event;
			
			// Update the content in context
			context.content = target.value;
			
			// Dispatch custom event for form integration
			const customEvent = new CustomEvent('surecart:content-changed', {
				detail: { content: target.value },
				bubbles: true,
				cancelable: false
			});
			
			target.dispatchEvent(customEvent);
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
	},
});
