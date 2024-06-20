import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';

export default ({ clientId, attributes }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId || ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);

	// if the block is not set return.
	if (!block?.name || !replaceBlock || !clientId) {
		return;
	}

	replaceBlock(clientId, [
		createBlock('surecart/product-collection-badges-v2', {
			limit: attributes?.limit,
			style: attributes?.style,
			type: attributes?.type,
		}),
	]);
};
