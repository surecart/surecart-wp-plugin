/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__qty',
	});

	const quantity = bundleItem?.quantity ?? 1;

	if (quantity <= 1) {
		return null;
	}

	return (
		<span {...blockProps}>
			&times; {quantity}
		</span>
	);
};
