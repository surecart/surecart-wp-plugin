/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __, sprintf, _x } from '@wordpress/i18n';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__name',
	});

	const productName =
		bundleItem?.component_product?.name ||
		bundleItem?.product?.name ||
		__('Product Name', 'surecart');

	const firstOption =
		bundleItem?.component_product?.variant_options?.data?.[0]?.name ||
		bundleItem?.product?.variant_options?.data?.[0]?.name ||
		__('Variant Option Name', 'surecart');

	const hasVariants =
		bundleItem?.component_product?.variant_options?.data?.length > 0 ||
		bundleItem?.product?.variant_options?.data?.length > 0 ||
		!bundleItem;

	const display = hasVariants
		? sprintf(
				/* translators: 1: product name, 2: variant option name. */
				_x(
					'%1$s - %2$s',
					'Bundle item name with variant option',
					'surecart'
				),
				productName,
				firstOption
		  )
		: productName;

	return <span {...blockProps}>{display}</span>;
};
