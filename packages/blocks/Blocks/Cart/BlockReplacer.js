/**
 * WordPress dependencies.
 */
import { store as blockEditorStore, getBlocks } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { newCartTemplate } from './NewCartTemplate';

export const BlockReplacer = ({ clientId, blockType, attributes }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);

	const childBlocks = select('core/block-editor').getBlocks(clientId);
	const newCart = newCartTemplate(childBlocks);

	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId) return;

		replaceBlock(clientId, [
			createBlock(
				blockType,
				{
					...attributes,
					title: attributes?.title || 'Cart',
					width: attributes?.width || '500px',
				},
				createBlocksFromInnerBlocksTemplate(newCart)
			),
		]);
	}, [block, replaceBlock, clientId, blockType]);
};
