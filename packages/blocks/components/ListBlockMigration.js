import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { newShopTemplate } from './NewShopTemplate';
import { useEntityRecords } from '@wordpress/core-data';

export default ({ clientId, blockType, attributes }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);
	const products = useEntityRecords('postType', 'sc_product', {
		page: 1,
		per_page: -1,
		sc_id: attributes?.ids,
	});

	const childBlocks = select('core/block-editor').getBlocks(clientId);
	const newShop = newShopTemplate(attributes, childBlocks);
	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId || !products?.records)
			return;
		const ids = (products?.records || []).map((product) => product.id);
		replaceBlock(clientId, [
			createBlock(
				blockType,
				{
					limit: attributes?.limit,
					style: attributes?.style,
					ids: ids,
					type: attributes?.type,
					align: attributes?.align,
					metadata: {
						categories: ['surecart_shop'],
						patternName: 'surecart-list-standard',
						name: __('Product List (Migrated)', 'surecart'),
					},
				},
				createBlocksFromInnerBlocksTemplate(newShop)
			),
		]);
	}, [block, replaceBlock, clientId, blockType, products]);
};
