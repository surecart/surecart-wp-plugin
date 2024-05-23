import { store as blockEditorStore, getBlocks } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { newShopTemplate } from './NewShopTemplate';

export const BlockReplacer = ({ clientId, blockType, attributes }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);
	const childBlocks = select('core/block-editor').getBlocks(clientId);
	const newShop = newShopTemplate(attributes, childBlocks);
	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId) return;
		replaceBlock(clientId, [
			createBlock(
				blockType,
				{
					limit: attributes?.limit,
					style: attributes?.style,
					ids: attributes?.ids,
					type: attributes?.type,
				},
				createBlocksFromInnerBlocksTemplate(newShop)
			),
		]);
	}, [block, replaceBlock, clientId, blockType]);
};
