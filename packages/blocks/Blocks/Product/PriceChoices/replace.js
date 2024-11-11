import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

const newPriceChoicesTemplate = (attributes) => {
	const defaultTextColor = attributes?.textColor || defaultTextColor;
	return [
		[
			'surecart/product-price-choice-template',
			{
				backgroundColor: attributes?.backgroundColor,
				textColor: attributes?.textColor,
				borderColor: attributes?.borderColor,
				layout: {
					type: 'flex',
					justifyContent: 'left',
					flexWrap: 'nowrap',
					orientation: 'horizontal',
				},
				style: {
					...(attributes?.style || {}),
				},
			},
			[
				[
					'surecart/price-name',
					{
						style: {
							layout: { selfStretch: 'fixed', flexSize: '50%' },
							typography: {
								fontStyle: 'normal',
								fontWeight: '600',
							},
						},
					},
					[],
				],
				[
					'core/group',
					{
						style: {
							spacing: { blockGap: '0px' },
							layout: { selfStretch: 'fixed', flexSize: '50%' },
						},
						layout: {
							type: 'flex',
							orientation: 'vertical',
							justifyContent: 'right',
						},
					},
					[
						[
							'core/group',
							{
								style: {
									spacing: { blockGap: '0.5rem' },
								},
								layout: {
									type: 'flex',
									flexWrap: 'nowrap',
									justifyContent: 'left',
								},
							},
							[
								[
									'surecart/price-scratch-amount',
									{
										style: {
											typography: {
												fontStyle: 'normal',
												fontWeight: '700',
												textDecoration: 'line-through',
											},
											color: { text: '#686868' },
										},
									},
									[],
								],
								[
									'surecart/price-amount',
									{
										style: {
											typography: {
												fontStyle: 'normal',
												fontWeight: '700',
											},
										},
									},
									[],
								],
								[
									'surecart/price-interval',
									{
										style: {
											typography: {
												fontStyle: 'normal',
												fontWeight: '700',
											},
										},
									},
									[],
								],
							],
						],
						[
							'surecart/price-trial',
							{
								style: {
									color: { text: defaultTextColor },
									elements: {
										link: {
											color: {
												text: defaultTextColor,
											},
										},
									},
								},
								fontSize: 'small',
							},
							[],
						],
						[
							'surecart/price-setup-fee',
							{
								style: {
									color: { text: defaultTextColor },
									elements: {
										link: {
											color: {
												text: defaultTextColor,
											},
										},
									},
								},
								fontSize: 'small',
							},
							[],
						],
					],
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
					'surecart/product-price-chooser',
					{
						type: attributes?.type,
					},
					createBlocksFromInnerBlocksTemplate(
						newPriceChoicesTemplate(attributes)
					)
				),
			])
		);
	}, []);
};
