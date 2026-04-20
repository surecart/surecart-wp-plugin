/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__name',
	});

	const name = bundleItem?.product?.name || '';

	return <span {...blockProps}>{name}</span>;
};
