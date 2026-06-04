/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__qty',
	});

	const quantity = Math.max(1, Number(bundleItem?.quantity) || 1);

	// Hide the `× 1` multiplier for single-quantity rows.
	if (quantity <= 1) {
		return null;
	}

	return <span {...blockProps}>&times; {quantity}</span>;
};
