/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default ({ context }) => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-pagination-next',
	});

	const paginationArrow = context?.paginationArrow || 'chevron';
	const iconName =
		paginationArrow === 'arrow' ? 'arrow-right' : 'chevron-right';

	return (
		<button {...blockProps} type="button" disabled>
			<ScIcon name={iconName} width={24} height={24} />
		</button>
	);
};
