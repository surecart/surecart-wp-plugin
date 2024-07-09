import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const newPriceTemplate = (attributes) => {
	const defaultColor = attributes?.textColor || '#8a8a8a';
	const defaultFontSize = attributes?.style?.typography?.fontSize || '24px';
	const wrapperGroupAttributes = {
		style: { spacing: { blockGap: '0.5em' } },
		layout: {
			type: 'flex',
			flexWrap: 'nowrap',
			justifyContent: attributes?.alignment || 'left',
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
					{ style: { typography: { fontSize: defaultFontSize } } },
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
