/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { actions } = store('surecart/sticky-purchase', {
	state: {
		get isVisible() {
			return getContext()?.isVisible || false;
		},
		get lastScrollY() {
			return getContext()?.lastScrollY || 0;
		},
	},

	actions: {
		toggleVisibility() {
			const context = getContext() || {};
			if (context.ticking) return;

			const stickyButton = document.querySelector('.sc-sticky-purchase');
			if (!stickyButton) return;

			context.ticking = true;
			const { ref: productBuyButtonRef } = getElement();
			const scrollY = window.scrollY;
			const scrollDirection =
				scrollY > context.lastScrollY ? 'down' : 'up';
			context.lastScrollY = scrollY;

			// Check if at bottom of page.
			const atBottom =
				scrollY + window.innerHeight >= actions.getDocumentHeight();

			// Show sticky button if buy button is out of view and conditions are met
			const buyButtonOutOfView =
				productBuyButtonRef?.getBoundingClientRect().bottom < 0;
			const shouldShow =
				buyButtonOutOfView && (!atBottom || scrollDirection === 'up');

			if (shouldShow !== context.isVisible) {
				context.isVisible = shouldShow;

				// Clear any existing hide timeout
				if (context.hideTimer) {
					clearTimeout(context.hideTimer);
					context.hideTimer = null;
				}

				if (shouldShow) {
					// Show immediately.
					stickyButton.classList.remove('is-hiding');
					stickyButton.classList.add('is-visible');
					document.body.classList.add('sc-sticky-purchase-active');

					// Set height CSS variable only once when first showing.
					if (!context.heightSet) {
						requestAnimationFrame(() => {
							document.documentElement.style.setProperty(
								'--sc-sticky-purchase-height',
								`${stickyButton.offsetHeight}px`
							);
							context.heightSet = true;
						});
					}
				} else {
					// Hide with animation.
					stickyButton.classList.add('is-hiding');
					context.hideTimer = setTimeout(() => {
						if (!context.isVisible) {
							stickyButton.classList.remove('is-visible');
							document.body.classList.remove(
								'sc-sticky-purchase-active'
							);
						}
					}, 300);
				}
			}

			// Auto-hide at bottom with delay.
			if (atBottom && scrollDirection === 'down' && context.isVisible) {
				context.hideTimer = setTimeout(() => {
					const currentAtBottom =
						window.scrollY + window.innerHeight >=
						actions.getDocumentHeight() - 10;
					if (currentAtBottom && context.isVisible) {
						context.isVisible = false;
						stickyButton.classList.add('is-hiding');
						setTimeout(() => {
							stickyButton.classList.remove('is-visible');
							document.body.classList.remove(
								'sc-sticky-purchase-active'
							);
						}, 300);
					}
				}, 500);
			}

			context.ticking = false;
		},

		getDocumentHeight() {
			return Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight
			);
		},
	},

	callbacks: {
		*init() {
			const context = getContext();
			if (!context) return;

			// Initialize.
			Object.assign(context, {
				isVisible: false,
				ticking: false,
				lastScrollY: window.scrollY,
				hideTimer: null,
				heightSet: false,
			});

			document.body.classList.remove('sc-sticky-purchase-active');
			document.documentElement.style.setProperty(
				'--sc-sticky-purchase-height',
				'80px'
			);
		},
	},
});
