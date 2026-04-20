/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__price',
	});

	const displayAmount = bundleItem?.price?.display_amount || '';

	if (!displayAmount) {
		return null;
	}

	return <span {...blockProps}>{displayAmount}</span>;
};
