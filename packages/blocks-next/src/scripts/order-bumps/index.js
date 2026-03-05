/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { __, sprintf } = wp.i18n;
const { state: checkoutState, actions: checkoutActions } =
	store('surecart/checkout');

/**
 * Check if a bump is already in cart.
 *
 * @param {Object} bump The bump object.
 * @return {boolean} Whether the bump is in cart.
 */
const isBumpInCart = (bump) => {
	const lineItems = checkoutState?.checkout?.line_items?.data || [];
	return lineItems.some((item) => item.bump === bump?.id);
};

/**
 * Track previous bump count to detect changes.
 */
let previousBumpCount = null;

/**
 * Scroll carousel to start after DOM updates.
 * Uses requestAnimationFrame to wait for the browser's next paint cycle,
 * ensuring DOM updates from the Interactivity API have been applied.
 */
const scrollCarouselToStart = () => {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			document
				.querySelector('.wp-block-surecart-cart-order-bump-template')
				?.scrollTo({ left: 0, behavior: 'instant' });
		});
	});
};

/**
 * Order Bumps store.
 */
const { state, actions } = store('surecart/order-bumps', {
	state: {
		/**
		 * Current scroll index.
		 */
		currentIndex: 0,

		/**
		 * Get all recommended bumps (excludes products with variants and optionally added items).
		 */
		get orderBumps() {
			const context = getContext();
			const hideAddedItems = context?.hideAddedItems ?? true;

			const bumps = (
				checkoutState?.checkout?.recommended_bumps?.data || []
			).filter((bump) => {
				const product = bump?.price?.product;
				// Exclude products with variants.
				if (product?.variants?.pagination?.count) {
					return false;
				}
				// Optionally exclude items already in cart.
				if (hideAddedItems && isBumpInCart(bump)) {
					return false;
				}
				return true;
			});

			// Reset pagination when bump count changes (item added/removed from cart).
			if (
				previousBumpCount !== null &&
				previousBumpCount !== bumps.length
			) {
				state.currentIndex = 0;
				scrollCarouselToStart();
			}
			previousBumpCount = bumps.length;

			return bumps;
		},

		/**
		 * Check if there are any order bumps to display.
		 */
		get hasOrderBumps() {
			return state.orderBumps.length > 0;
		},

		/**
		 * Check if there are multiple bumps (for carousel).
		 */
		get hasMultipleBumps() {
			return state.orderBumps.length > 1;
		},

		/**
		 * Check if there is a previous item.
		 */
		get hasPreviousPage() {
			return state.currentIndex > 0;
		},

		/**
		 * Check if there is a next item.
		 */
		get hasNextPage() {
			return state.currentIndex < state.orderBumps.length - 1;
		},

		/**
		 * Check if pagination should be shown.
		 */
		get showPagination() {
			return state.orderBumps.length > 1;
		},

		/**
		 * Check if current bump has a discount.
		 */
		get bumpHasDiscount() {
			const { bump } = getContext();
			return bump?.percent_off > 0 || bump?.amount_off > 0;
		},

		/**
		 * Get discount text for badge.
		 */
		get bumpDiscountText() {
			const { bump } = getContext();
			if (bump?.percent_off) {
				return `-${bump.percent_off}%`;
			}
			if (bump?.amount_off) {
				return `-${bump.amount_off_display_amount}`;
			}
			return '';
		},

		/**
		 * Check if bump is already in cart.
		 */
		get isBumpInCart() {
			const { bump } = getContext();
			return isBumpInCart(bump);
		},

		/**
		 * Get bump product image.
		 */
		get bumpImage() {
			const { bump } = getContext();
			return bump?.price?.product?.line_item_image || null;
		},

		/**
		 * Get bump product name.
		 */
		get bumpName() {
			const { bump } = getContext();
			return bump?.name || bump?.price?.product?.name || '';
		},

		/**
		 * Get bump CTA text from metadata.
		 */
		get bumpCta() {
			const { bump } = getContext();
			return bump?.metadata?.cta || '';
		},

		/**
		 * Get accessible label for order bumps list/carousel.
		 */
		get orderBumpsListAriaLabel() {
			return state.hasMultipleBumps
				? __(
						'Order bumps carousel. Use left and right arrow keys to navigate.',
						'surecart'
				  )
				: __('Order bump', 'surecart');
		},

		/**
		 * Get accessible label for add button that includes product name.
		 */
		get addButtonAriaLabel() {
			const { bump } = getContext();
			const productName = bump?.name || bump?.price?.product?.name || '';

			if (state.isBumpInCart) {
				// translators: %s: product name
				return sprintf(__('%s added to cart', 'surecart'), productName);
			}

			// translators: %s: product name
			return sprintf(__('Add %s to cart', 'surecart'), productName);
		},
	},

	actions: {
		/**
		 * Handle keydown on add button (Enter/Space to add).
		 */
		handleAddButtonKeydown: function* (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				yield* actions.addBumpToCart(e);
			}
		},

		/**
		 * Scroll to previous item.
		 */
		previousPage: function* (e) {
			e?.preventDefault();
			if (state.hasPreviousPage) {
				state.currentIndex--;
				actions.scrollToCurrentItem(e);
			}
		},

		/**
		 * Scroll to next item.
		 */
		nextPage: function* (e) {
			e?.preventDefault();
			if (state.hasNextPage) {
				state.currentIndex++;
				actions.scrollToCurrentItem(e);
			}
		},

		/**
		 * Handle keydown on previous button (Enter/Space to navigate).
		 */
		handlePreviousKeydown(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				actions.previousPage(e);
			}
		},

		/**
		 * Handle keydown on next button (Enter/Space to navigate).
		 */
		handleNextKeydown(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				actions.nextPage(e);
			}
		},

		/**
		 * Handle keydown on carousel for arrow key navigation.
		 */
		handleCarouselKeydown(e) {
			// Only handle arrow keys.
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				e.preventDefault();

				if (e.key === 'ArrowLeft') {
					actions.previousPage(e);
				} else if (e.key === 'ArrowRight') {
					actions.nextPage(e);
				}
			}
		},

		/**
		 * Add bump to cart.
		 */
		addBumpToCart: function* (e) {
			e?.preventDefault();

			const context = getContext();
			const { bump } = context;

			// Get mode and formId from parent checkout context.
			const mode =
				context.mode ||
				(checkoutState?.checkout?.live_mode ? 'live' : 'test');
			const formId = context.formId;

			if (!bump || state.isBumpInCart) {
				return;
			}

			const { addCheckoutLineItem } = yield import(
				/* webpackIgnore: true */
				'@surecart/checkout-service'
			);

			const { speak } = yield import(
				/* webpackIgnore: true */
				'@wordpress/a11y'
			);

			try {
				checkoutState.loading = true;

				const checkout = yield* addCheckoutLineItem({
					price: bump?.price?.id,
					quantity: 1,
					bump: bump?.id,
				});

				if (checkout) {
					// Update checkout state directly.
					checkoutState.checkout = checkout;

					// Also update local storage if mode and formId available.
					if (mode && formId) {
						checkoutActions.setCheckout(checkout, mode, formId);
					}

					speak(__('Item added to cart.', 'surecart'), 'assertive');
				}
			} catch (error) {
				console.error(error);
				checkoutState.error = error;
			} finally {
				checkoutState.loading = false;
			}
		},

		/**
		 * Scroll to current item in the carousel.
		 */
		scrollToCurrentItem(e) {
			const button = e?.target;
			if (!button) return;

			// Find the carousel container.
			const container = button.closest(
				'.wp-block-surecart-cart-order-bumps'
			);
			if (!container) return;

			actions.scrollCarouselToIndex(container, state.currentIndex);
		},

		/**
		 * Scroll carousel to a specific index.
		 */
		scrollCarouselToIndex(container, index) {
			const carousel = container?.querySelector(
				'.wp-block-surecart-cart-order-bump-template'
			);
			const items = carousel?.querySelectorAll(
				'.sc-cart-order-bump-item'
			);

			if (items && items[index]) {
				items[index].scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'start',
				});
			}
		},
	},

	callbacks: {
		/**
		 * Initialize order bumps state.
		 */
		init() {
			// Reset index when component initializes
			state.currentIndex = 0;
		},

		/**
		 * Handle carousel scroll end for manual swipe detection.
		 * Updates currentIndex based on scroll position.
		 */
		onCarouselScroll() {
			const { ref: carousel } = getElement();
			if (!carousel) return;

			const items = carousel.querySelectorAll('.sc-cart-order-bump-item');
			if (!items.length) return;

			// Calculate which item is most visible based on scroll position.
			const scrollLeft = carousel.scrollLeft;
			const itemWidth = items[0].offsetWidth;
			const gap = parseFloat(getComputedStyle(carousel).gap) || 0;

			// Calculate the index based on scroll position.
			const newIndex = Math.round(scrollLeft / (itemWidth + gap));

			// Clamp to valid range and update if changed.
			const clampedIndex = Math.max(
				0,
				Math.min(newIndex, items.length - 1)
			);
			if (state.currentIndex !== clampedIndex) {
				state.currentIndex = clampedIndex;
			}
		},
	},
});
