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
 * Line item details store.
 *
 * Owns the single collapse for the line item details container. Children
 * (bundle components, note) just render their content — this store decides
 * when the toggle is needed (content overflows the first line) and flips the
 * expanded state for the whole region.
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
		 * Focusable only when collapsible — keeps parity with the note's
		 * "click anywhere on the line" behavior for mouse and keyboard.
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
					// Compare full content height to one line. scrollHeight is the
					// unclamped height even while collapsed, so this works the same
					// whether the region starts expanded or collapsed — and avoids
					// a pointless chevron on single-line content when "expanded by
					// default" is on.
					const styles = window.getComputedStyle( content );
					let lineHeight = parseFloat( styles.lineHeight );
					if ( ! lineHeight || Number.isNaN( lineHeight ) ) {
						lineHeight = ( parseFloat( styles.fontSize ) || 14 ) * 1.4;
					}
					context.showToggle = content.scrollHeight > lineHeight + 1;
				};

				checkOverflow();

				const resizeObserver = new ResizeObserver( checkOverflow );
				resizeObserver.observe( content );

				return () => resizeObserver.disconnect();
			}, [] );
		},
	},
} );
