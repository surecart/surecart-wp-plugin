/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({
	context: {
		'surecart/bundleItem': bundleItem,
		'surecart/bundleItemOption': bundleItemOption,
	},
}) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__variant-name',
	});

	const optionName =
		bundleItemOption?.name ||
		bundleItem?.component_product?.variant_options?.data?.[0]?.name ||
		bundleItem?.product?.variant_options?.data?.[0]?.name ||
		__('Variant Option Name', 'surecart');

	return <span {...blockProps}>{optionName}</span>;
};
