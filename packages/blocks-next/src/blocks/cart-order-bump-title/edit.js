/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-title',
	});

	return <span {...blockProps}>{__('Product Name', 'surecart')}</span>;
};
