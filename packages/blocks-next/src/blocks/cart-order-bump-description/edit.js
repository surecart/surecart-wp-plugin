/**
 * External dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-description',
	});

	return (
		<div {...blockProps}>
			{__('Product bump description will appear here...', 'surecart')}
		</div>
	);
};
