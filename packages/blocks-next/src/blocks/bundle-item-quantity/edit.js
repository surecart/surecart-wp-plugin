/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__qty',
	});

	// Always show a sample "× 2" in the editor so the slot stays visible.
	// The runtime view hides this block entirely when quantity <= 1.
	const quantity = bundleItem?.quantity ?? 2;

	return (
		<span {...blockProps}>
			&times; {quantity > 1 ? quantity : 2}
		</span>
	);
};
