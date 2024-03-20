import {
	useBlockProps,
	PlainText
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const arrowMap = {
	none: '',
	arrow: '→',
	chevron: '»',
};

export default ({ 
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel } 
}) => {
	const displayArrow = arrowMap[ paginationArrow ];
	return (
		<a
			href="#pagination-next-pseudo-link"
			onClick={ ( event ) => event.preventDefault() }
			{ ...useBlockProps() }
		>
			{ showLabel && (
				<PlainText
					__experimentalVersion={ 2 }
					tagName="span"
					aria-label={ __( 'Next page link' ) }
					placeholder={ __( 'Next' ) }
					value={ label }
					onChange={ ( newLabel ) =>
						setAttributes( { label: newLabel } )
					}
				/>
			) }
			{ displayArrow && (
				<span
					className={ `wp-block-product-pagination-next-arrow is-arrow-${ paginationArrow }` }
					aria-hidden={ true }
				>
					{ displayArrow }
				</span>
			) }
		</a>
	);
};
