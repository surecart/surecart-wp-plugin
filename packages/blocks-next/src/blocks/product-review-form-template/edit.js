/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Edit({ context }) {
	const editingView = context['surecart/editingView'] || 'form';
	const isActive = editingView === 'form';

	const blockProps = useBlockProps({
		style: {
			display: isActive ? 'block' : 'none',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return <div {...innerBlocksProps} />;
}
