import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default ({ clientId, attributes }) => {
	const { replaceBlock } = useDispatch(blockEditorStore);

	// if the block is not set return.
	if (!block?.name || !replaceBlock || !clientId) {
		return;
	}

	useEffect(() => {
		setTimeout(() =>
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
			])
		);
	}, []);
};
