/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__product-name',
	});

	const productName =
		bundleItem?.component_product?.name ||
		bundleItem?.product?.name ||
		__('Product Name', 'surecart');

	return <span {...blockProps}>{productName}</span>;
};
