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
					// Show the toggle only when the content exceeds the collapse threshold.
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
					const collapseAfter = Math.max(
						Number( context.collapseAfter ) || 2,
						1
					);
					context.showToggle = lines > collapseAfter;
				};

				checkOverflow();

				const resizeObserver = new ResizeObserver( checkOverflow );
				resizeObserver.observe( content );

				return () => resizeObserver.disconnect();
			}, [] );
		},
	},
} );
