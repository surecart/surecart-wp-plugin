import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

const newPriceChoicesTemplate = (attributes) => {
	const defaultTextColor = attributes?.textColor || defaultTextColor;
	return [
		[
			'surecart/product-price-choices-template',
			{
				style: {
					spacing: {
						...(attributes?.styles?.spacing || {}),
					},
				},
				layout: {
					type: 'grid',
					columnCount: 2,
					justifyContent: 'stretch',
					orientation: 'vertical',
					flexWrap: 'nowrap',
					verticalAlignment: 'center',
				},
			},
			[
				[
					'surecart/product-price-choice-template',
					{
						backgroundColor: attributes?.backgroundColor,
						textColor: attributes?.textColor,
						layout: {
							type: 'flex',
							justifyContent: 'space-between',
							flexWrap: 'nowrap',
							orientation: 'horizontal',
						},
						style: {
							...attributes?.style,
							spacing: null,
						},
					},
					[
						[
							'surecart/price-name',
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
							'core/group',
							{
								style: { spacing: { blockGap: '0px' } },
								layout: {
									type: 'flex',
									orientation: 'vertical',
									justifyContent: 'right',
								},
							},
							[
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
