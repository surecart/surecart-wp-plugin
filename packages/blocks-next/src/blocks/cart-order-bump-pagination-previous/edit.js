/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { isRTL } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Icon from '../../components/Icon';

const ARROWS = {
	arrow: isRTL() ? 'arrow-right' : 'arrow-left',
	chevron: isRTL() ? 'chevron-right' : 'chevron-left',
};

export default ({ context }) => {
	const blockProps = useBlockProps();
	const paginationArrow = context?.paginationArrow || 'chevron';
	const paginationArrowSize = context?.paginationArrowSize || 20;
	const icon = ARROWS[paginationArrow];

	return (
		<button {...blockProps} type="button" disabled>
			<Icon
				name={icon}
				width={paginationArrowSize}
				height={paginationArrowSize}
				className="wp-block-surecart-cart-order-bump-pagination-previous__icon"
				aria-hidden={true}
			/>
		</button>
	);
};
