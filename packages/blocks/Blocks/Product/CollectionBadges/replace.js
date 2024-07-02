import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
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
		createBlock(
			'surecart/product-collection-tags',
			{
				count: attributes?.count,
				style: {
					spacing: {
						blockGap: attributes?.spacing?.blockGap,
					},
				},
				type: attributes?.type,
			},
			createBlocksFromInnerBlocksTemplate([
				['surecart/product-collection-tag', attributes, []],
			])
		),
	]);
};
