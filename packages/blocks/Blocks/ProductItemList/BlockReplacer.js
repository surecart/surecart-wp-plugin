import { store as blockEditorStore } from '@wordpress/block-editor';
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
	const newShop = newShopTemplate(attributes);
	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId) return;
		replaceBlock(clientId, [
			createBlock(
				blockType,
				{ limit: attributes?.limit },
				createBlocksFromInnerBlocksTemplate(newShop)
			),
		]);
	}, [block, replaceBlock, clientId, blockType]);
};
