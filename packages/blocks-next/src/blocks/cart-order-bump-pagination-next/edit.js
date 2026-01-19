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
	arrow: isRTL() ? 'arrow-left' : 'arrow-right',
	chevron: isRTL() ? 'chevron-left' : 'chevron-right',
};

export default ({ context }) => {
	const blockProps = useBlockProps();
	const paginationArrow = context?.paginationArrow || 'chevron';
	const paginationArrowSize = context?.paginationArrowSize || 20;
	const icon = ARROWS[paginationArrow];

	return (
		<div {...blockProps} role="button" tabindex="0" disabled>
			<Icon
				name={icon}
				width={paginationArrowSize}
				height={paginationArrowSize}
				className="wp-block-surecart-cart-order-bump-pagination-next__icon"
				aria-hidden={true}
			/>
		</div>
	);
};
