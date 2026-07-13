/**
 * WordPress dependencies.
 */
import {
	store,
	getContext,
	getElement,
	useEffect,
} from '@wordpress/interactivity';

/**
 * Check if the event is a keydown that is not a submit key.
 */
const isNotKeySubmit = ( e ) => {
	return e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ';
};

/**
 * Line item details store — owns the collapse/expand state for the details region.
 */
store( 'surecart/line-item-details', {
	state: {
		/**
		 * Make the row a button only when there's something to expand.
		 */
		get role() {
			return getContext()?.showToggle ? 'button' : null;
		},

		/**
		 * Focusable only when collapsible.
		 */
		get tabindex() {
			return getContext()?.showToggle ? '0' : '-1';
		},
	},

	actions: {
		toggleDetailsExpanded( e ) {
			if ( isNotKeySubmit( e ) ) {
				return true;
			}

			const context = getContext();
			if ( ! context || ! context.showToggle ) {
				return;
			}

			if ( e?.preventDefault ) {
				e.preventDefault();
			}

			context.detailsExpanded = ! context.detailsExpanded;
		},
	},

	callbacks: {
		init() {
			const context = getContext();

			useEffect( () => {
				const { ref } = getElement();
				if ( ! ref || ! context ) return;

				const content = ref.querySelector(
					'.sc-cart-line-item-details__content'
				);
				if ( ! content ) {
					context.showToggle = false;
					return;
				}

				const checkOverflow = () => {
					const collapseAfter = Math.max(
						Number( context.collapseAfter ) || 2,
						1
					);

					// Bundles render one row per component, so the overflow and
					// the hidden count are exact — count the rendered rows
					// directly (this already reflects the variants-only filter).
					const bundleRows = content.querySelectorAll(
						'.sc-cart-line-item-variant__bundle-item'
					);
					if ( bundleRows.length ) {
						context.hiddenCount = Math.max(
							bundleRows.length - collapseAfter,
							0
						);
						context.showToggle = bundleRows.length > collapseAfter;
						return;
					}

					// Non-bundle details (variant text, note): fall back to
					// measuring wrapped lines. No countable items, so no "+N".
					const styles = window.getComputedStyle( content );
					let lineHeight = parseFloat( styles.lineHeight );
					if ( ! lineHeight || Number.isNaN( lineHeight ) ) {
						lineHeight = ( parseFloat( styles.fontSize ) || 14 ) * 1.4;
					}
					const rowGap = parseFloat( styles.rowGap ) || 0;
					const lines = Math.round(
						( content.scrollHeight + rowGap ) /
							( lineHeight + rowGap )
					);
					context.hiddenCount = 0;
					context.showToggle = lines > collapseAfter;
				};

				checkOverflow();

				const resizeObserver = new ResizeObserver( checkOverflow );
				resizeObserver.observe( content );

				// Rows are rendered/filtered reactively; a resize may not fire
				// when only their count changes, so watch the subtree too.
				const mutationObserver = new MutationObserver( checkOverflow );
				mutationObserver.observe( content, {
					childList: true,
					subtree: true,
				} );

				return () => {
					resizeObserver.disconnect();
					mutationObserver.disconnect();
				};
			}, [] );
		},
	},
} );
