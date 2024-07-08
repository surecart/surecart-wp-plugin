import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

export default ({ clientId, attributes }) => {
	const { replaceBlock } = useDispatch(blockEditorStore);

	useEffect(() => {
		setTimeout(() => {
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
		});
	});
};
