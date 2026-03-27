/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-add-button',
	});

	return (
		<div {...blockProps} role="button" tabIndex="0">
			<ScIcon name="plus" />
		</div>
	);
};
