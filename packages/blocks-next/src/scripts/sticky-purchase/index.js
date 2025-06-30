/**
 * WordPress dependencies.
 */
import { store, getElement } from '@wordpress/interactivity';

// Check if two elements overlap.
const doElementsOverlap = (elementA, elementB) => {
	const A = elementA.getBoundingClientRect();
	const B = elementB.getBoundingClientRect();
	return !(
		A.right < B.left ||
		A.left > B.right ||
		A.bottom < B.top ||
		A.top > B.bottom
	);
};

const { state } = store('surecart/sticky-purchase', {
	state: {
		stickyButtonElement() {
			return document.querySelector('.sc-sticky-purchase');
		},
		floatingCartElement() {
			return document.querySelector('.wp-block-surecart-cart-icon');
		},
		isVisible: false,
	},

	actions: {
		toggleVisibility() {
			const stickyButton = state.stickyButtonElement();
			if (!stickyButton) return;

			const { ref: buyButton } = getElement();

			// Check if at bottom of page.
			const atBottom =
				window.scrollY + window.innerHeight >=
				Math.max(
					document.body.scrollHeight,
					document.documentElement.scrollHeight
				);

			// If at bottom of page, hide sticky button.
			if (atBottom) {
				state.isVisible = false;
				return;
			}

			// Show sticky button if buy button is out of view and conditions are met.
			state.isVisible = buyButton?.getBoundingClientRect().bottom < 0;
		},
	},
	callbacks: {
		updateStickyOffsetVariables() {
			// not visible, remove the variable.
			if (!state.isVisible) {
				document.body.style.removeProperty('--sc-cart-icon-bottom');
				return;
			}

			const { ref } = getElement();
			const stickyRect = ref.getBoundingClientRect();

			// remove this so we can (re)calculate the overlap.
			document.body.style.removeProperty('--sc-cart-icon-bottom');

			// If no floating cart element, do not adjust the offset.
			const floatingCartElement = state.floatingCartElement();
			if (
				!floatingCartElement ||
				!doElementsOverlap(ref, floatingCartElement)
			) {
				return;
			}

			// Distance from bottom of element to bottom of viewport.
			const distanceFromBottom = window.innerHeight - stickyRect.bottom;

			document.body.style.setProperty(
				'--sc-cart-icon-bottom',
				`${distanceFromBottom + stickyRect.height + 20}px`
			);
		},
	},
});
