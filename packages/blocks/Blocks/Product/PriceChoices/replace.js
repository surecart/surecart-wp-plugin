import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';

const newPriceChoicesTemplate = (attributes) => {
	return [
		[
			'surecart/product-price-choices-template',
			{
				layout: {
					type: 'grid',
					columnCount: 2,
				},
			},
			[
				[
					'surecart/product-price-choice-template',
					{
						style: attributes?.style,
						backgroundColor: attributes?.backgroundColor,
					},
					[
						[
							'core/group',
							{
								layout: {
									type: 'flex',
									flexWrap: 'wrap',
									justifyContent: 'space-between',
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
													color: { text: '#8a8a8a' },
													elements: {
														link: {
															color: {
																text: '#8a8a8a',
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
													color: { text: '#8a8a8a' },
													elements: {
														link: {
															color: {
																text: '#8a8a8a',
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

	replaceBlock(clientId, [
		createBlock(
			'surecart/product-price-chooser',
			{
				limit: attributes?.limit,
				type: attributes?.type,
			},
			createBlocksFromInnerBlocksTemplate(
				newPriceChoicesTemplate(attributes)
			)
		),
	]);
};
