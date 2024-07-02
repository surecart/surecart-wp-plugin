import { useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

const newVariantPillsTemplate = (attributes) => {
	const pillAttributes = {
		...attributes,
		highlight_text: '#ffffff',
		highlight_background: '#000000',
		highlight_border: '#000000',
	};

	if (pillAttributes?.style?.spacing?.margin) {
		delete pillAttributes.style.spacing.margin; // margin belongs to the wrapper parent.
	}

	return [
		[
			'surecart/product-variant-pills-wrapper',
			{},
			[
				[
					'surecart/product-variant-pill',
					{
						...pillAttributes,
					},
					[],
				],
			],
		],
	];
};

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

	// Replace the block with the new block.
	replaceBlock(clientId, [
		createBlock(
			'surecart/product-variant-pills',
			{
				style: {
					spacing: {
						margin: attributes?.style?.spacing?.margin,
					},
				},
			},
			createBlocksFromInnerBlocksTemplate(
				newVariantPillsTemplate(attributes)
			)
		),
	]);
};
