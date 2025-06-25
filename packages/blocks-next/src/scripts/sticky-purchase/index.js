/**
 * WordPress dependencies.
 */
import { store, getContext, withScope } from '@wordpress/interactivity';

// controls the sticky purchase behavior.
const { actions } = store('surecart/sticky-purchase', {
	state: {
		get isVisible() {
			const context = getContext();
			return context?.isVisible || false;
		},
		get ticking() {
			const context = getContext();
			return context?.ticking || false;
		},
		get lastScrollY() {
			const context = getContext();
			return context?.lastScrollY || 0;
		},
		get scrollDirection() {
			const context = getContext();
			return context?.scrollDirection || 'down';
		},
		get viewportHeight() {
			const context = getContext();
			return context?.viewportHeight || window.innerHeight;
		},
		get hideTimeout() {
			const context = getContext();
			return context?.hideTimeout || null;
		},
	},

	actions: {
		handleScroll() {
			const context = getContext();
			if (!context) return;

			if (!context.ticking) {
				requestAnimationFrame(
					withScope(() => actions.updateStickyButtonVisibility())
				);
				context.ticking = true;
			}
		},

		handleResize() {
			const context = getContext();
			if (!context) return;

			context.viewportHeight = window.innerHeight;
			if (!context.ticking) {
				requestAnimationFrame(
					withScope(() => actions.updateStickyButtonVisibility())
				);
				context.ticking = true;
			}
		},

		updateStickyButtonVisibility() {
			const context = getContext();
			if (!context) return;

			const stickyButton = document.querySelector('.sc-sticky-purchase');
			const stickyContainer = document.querySelector(
				'.wp-block-surecart-sticky-purchase'
			);

			if (!stickyButton || !stickyContainer) {
				context.ticking = false;
				return;
			}

			// Look for the main product buy buttons.
			const productForm = document.querySelector(
				'[data-sc-block-id="product-page"]'
			);

			if (!productForm) {
				context.ticking = false;
				return;
			}

			let querySelector = '.wp-block-surecart-product-buy-button';
			if (typeof elementorFrontend !== 'undefined') {
				querySelector = '.elementor-widget-surecart-add-to-cart-button';
			} else if (typeof bricksData !== 'undefined') {
				querySelector = '.brxe-surecart-product-buy-button';
			}
			const productBuyButton = productForm.querySelector(querySelector);

			if (!productBuyButton) {
				context.ticking = false;
				return;
			}

			const rect = productBuyButton.getBoundingClientRect();
			const scrollY = window.scrollY;

			// Determine scroll direction.
			context.scrollDirection =
				scrollY > (context.lastScrollY || 0) ? 'down' : 'up';
			context.lastScrollY = scrollY;

			// Calculate if we're at the bottom of the page.
			const atBottom =
				scrollY + (context.viewportHeight || window.innerHeight) >=
				actions.getDocumentHeight();

			// Check if the buy buttons are out of view.
			const buyButtonsOutOfView = rect.bottom < 0;

			// Determine if we should show the sticky button.
			const shouldShow =
				buyButtonsOutOfView &&
				(!atBottom || context.scrollDirection === 'up');

			// Clear any pending hide timeout when scrolling.
			if (context.hideTimeout) {
				clearTimeout(context.hideTimeout);
				context.hideTimeout = null;
			}

			// Update visibility state.
			if (shouldShow !== context.isVisible) {
				context.isVisible = shouldShow;

				if (context.isVisible) {
					stickyButton.classList.remove('is-hiding');
					stickyButton.classList.add('is-visible');
					document.body.classList.add('sc-sticky-purchase-active');

					// Calculate and set the sticky purchase height as a CSS variable
					// for proper cart icon positioning.
					setTimeout(() => {
						const stickyHeight = stickyButton.offsetHeight;
						document.documentElement.style.setProperty(
							'--sc-sticky-purchase-height',
							`${stickyHeight}px`
						);
					}, 50);
				} else {
					stickyButton.classList.add('is-hiding');

					setTimeout(
						withScope(() => {
							const currentContext = getContext();
							if (!currentContext?.isVisible) {
								stickyButton.classList.remove('is-visible');
								document.body.classList.remove(
									'sc-sticky-purchase-active'
								);
							}
						}),
						500
					);
				}
			}

			// If user has stopped scrolling for more than 1 second and we're at the bottom,
			// hide the sticky button for better viewing of footer content.
			if (atBottom && context.scrollDirection === 'down') {
				context.hideTimeout = setTimeout(
					withScope(() => {
						const currentContext = getContext();
						if (!currentContext) return;

						// Recalculate atBottom with current scroll position.
						const currentScrollY = window.scrollY;
						const currentAtBottom =
							currentScrollY +
								(currentContext.viewportHeight ||
									window.innerHeight) >=
							actions.getDocumentHeight();

						if (currentAtBottom) {
							currentContext.isVisible = false;
							stickyButton.classList.add('is-hiding');
							setTimeout(
								withScope(() => {
									stickyButton.classList.remove('is-visible');
									document.body.classList.remove(
										'sc-sticky-purchase-active'
									);
								}),
								500
							);
						}
					}),
					1000
				);
			}

			context.ticking = false;
		},

		getDocumentHeight() {
			return Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.offsetHeight,
				document.body.clientHeight,
				document.documentElement.clientHeight
			);
		},
	},

	callbacks: {
		*init() {
			const context = getContext();
			if (!context) return;

			// Initialize context properties.
			context.isVisible = false;
			context.ticking = false;
			context.lastScrollY = window.scrollY;
			context.scrollDirection = 'down';
			context.viewportHeight = window.innerHeight;
			context.hideTimeout = null;
			document.body.classList.remove('sc-sticky-purchase-active');

			// Reset the CSS variable for sticky purchase height.
			document.documentElement.style.setProperty(
				'--sc-sticky-purchase-height',
				'80px'
			);

			// Initial check after a small delay to ensure DOM is fully rendered.
			setTimeout(
				withScope(() => {
					actions.updateStickyButtonVisibility();
				}),
				100
			);
		},
	},
});
