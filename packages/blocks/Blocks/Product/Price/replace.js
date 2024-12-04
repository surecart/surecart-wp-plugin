import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import edit from './edit';

const newPriceTemplate = (attributes) => {
	const defaultColor = attributes?.textColor || '#8a8a8a';
	const defaultFontSize = attributes?.style?.typography?.fontSize || '24px';
	const defaultLineHeight =
		attributes?.style?.typography?.lineHeight || '1.4';
	const wrapperGroupAttributes = {
		style: { spacing: { blockGap: '0.5em' } },
		layout: {
			type: 'flex',
			flexWrap: 'nowrap',
			justifyContent: attributes?.alignment || 'left',
			verticalAlignment: 'bottom',
		},
	};
	const priceDescriptionAttributes = {
		style: {
			color: { text: defaultColor },
			elements: { link: { color: { text: defaultColor } } },
			typography: { fontSize: '16px' },
		},
	};

	return [
		[
			'core/group',
			wrapperGroupAttributes,
			[
				[
					'surecart/product-selected-price-scratch-amount',
					{
						style: {
							typography: {
								textDecoration: 'line-through',
								fontSize: defaultFontSize,
								lineHeight: defaultLineHeight,
							},
							color: { text: defaultColor },
							elements: {
								link: { color: { text: defaultColor } },
							},
						},
					},
					[],
				],
				[
					'surecart/product-selected-price-amount',
					{
						style: {
							typography: {
								fontSize: defaultFontSize,
								lineHeight: defaultLineHeight,
							},
						},
					},
					[],
				],
				[
					'surecart/product-selected-price-interval',
					{
						style: {
							typography: {
								fontSize: '18px',
								lineHeight: '1.8',
							},
						},
					},
					[],
				],
				[
					'surecart/product-sale-badge',
					{
						text: attributes?.sale_text || __('Sale', 'surecart'),
						style: {
							border: { radius: '15px' },
							typography: { fontSize: '12px' },
							layout: { selfStretch: 'fit', flexSize: null },
							elements: {
								link: {
									color: { text: 'var:preset|color|white' },
								},
							},
						},
						textColor: 'white',
					},
					[],
				],
			],
		],
		[
			'core/group',
			wrapperGroupAttributes,
			[
				[
					'surecart/product-selected-price-trial',
					priceDescriptionAttributes,
					[],
				],
				[
					'surecart/product-selected-price-fees',
					priceDescriptionAttributes,
					[],
				],
			],
		],
	];
};

function checkBlockExistence(blockName, blocks = null) {
	if (blocks === null) {
		const { getBlocks } = select('core/block-editor');
		blocks = getBlocks();
	}

	for (const block of blocks) {
		if (block.name === blockName) {
			return true;
		}

		if (block.innerBlocks && block.innerBlocks.length > 0) {
			if (checkBlockExistence(blockName, block.innerBlocks)) {
				return true;
			}
		}
	}

	return false;
}

export default (props) => {
	const { clientId, attributes } = props;

	// find out if parent block is `surecart/upsell` block
	const is_upsell = checkBlockExistence('surecart/upsell');
	if (is_upsell) {
		return edit(props);
	}

	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId || ''),
		[clientId]
	);
	const { replaceBlock } = useDispatch(blockEditorStore);

	// if the block is not set return.
	if (!block?.name || !replaceBlock || !clientId) {
		return;
	}

	useEffect(() => {
		setTimeout(() =>
			replaceBlock(clientId, [
				createBlock(
					'core/group',
					{
						style: attributes?.style,
						textColor: attributes.textColor,
						backgroundColor: attributes.backgroundColor,
						spacing: {
							padding: {
								top: '0',
								bottom: '0',
								left: '0',
								right: '0',
							},
							...(attributes?.style?.spacing || {}),
						},
					},
					createBlocksFromInnerBlocksTemplate(
						newPriceTemplate(attributes)
					)
				),
			])
		);
	}, []);
};
