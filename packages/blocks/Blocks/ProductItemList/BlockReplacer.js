import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { newShopTemplate } from './NewShopTemplate';
import { useEntityRecords } from '@wordpress/core-data';

export const BlockReplacer = ({ clientId, blockType, attributes }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);
	const newShop = newShopTemplate(attributes);

	const products = useEntityRecords('postType', 'sc_product', {
		page: 1,
		per_page: -1,
		sc_id: attributes?.ids,
	});

	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId || !products?.records)
			return;
		const ids = (products?.records || []).map((product) => product.id);
		replaceBlock(clientId, [
			createBlock(
				blockType,
				{ limit: attributes?.limit, ids: ids, type: attributes?.type },
				createBlocksFromInnerBlocksTemplate(newShop)
			),
		]);
	}, [block, replaceBlock, clientId, blockType, products]);
};
