import {
	useBlockProps,
	PlainText
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const arrowMap = {
	none: '',
	arrow: '←',
	chevron: '«',
};

export default ({ 
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel } 
}) => {
	const displayArrow = arrowMap[ paginationArrow ];
	return (
		<a
			href="#pagination-previous-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			{ ...useBlockProps() }
		>
			{ displayArrow && (
				<span
					className={ `wp-block-product-pagination-previous-arrow is-arrow-${ paginationArrow }` }
					aria-hidden={ true }
				>
					{ displayArrow }
				</span>
			) }
			{ showLabel && (
				<PlainText
					__experimentalVersion={ 2 }
					tagName="span"
					aria-label={ __( 'Previous page link' ) }
					placeholder={ __( 'Previous' ) }
					value={ label }
					onChange={ ( newLabel ) =>
						setAttributes( { label: newLabel } )
					}
				/>
			) }
		</a>
	);
};
