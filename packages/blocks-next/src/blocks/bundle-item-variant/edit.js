/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__variant',
	});

	const variantName = bundleItem?.variant?.name || '';

	if (!variantName) {
		return null;
	}

	return <span {...blockProps}>{variantName}</span>;
};
