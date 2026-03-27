/**
 * WordPress dependencies.
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
export const BlockReplacer = ({ clientId, blockType, attributes }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);

	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId) return;
		replaceBlock(clientId, [createBlock(blockType, attributes)]);
	}, [block, replaceBlock, clientId, blockType]);
};
