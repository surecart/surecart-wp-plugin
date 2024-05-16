import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export const BlockReplacer = ({ clientId, blockType }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);
	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId) return;
		replaceBlock(clientId, [createBlock(blockType)]);
	}, [block, replaceBlock, clientId, blockType]);
};
