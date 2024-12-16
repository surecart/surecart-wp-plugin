import { __ } from '@wordpress/i18n';
export const newShopTemplate = (attributes, childBlocks) => {
	const {
		sort_enabled,
		search_enabled,
		pagination_enabled,
		collection_enabled,
		columns,
	} = attributes;

	const templateChildBlocks = childBlocks[0]?.innerBlocks.reduce(
		(acc, block) => {
			switch (block.name) {
				case 'surecart/product-item-title':
					acc.push([
						'surecart/product-title',
						{
							level: 3,
							...block?.attributes,
							style: {
								typography: {
									fontSize: '15px',
									...(block?.attributes?.style?.typography ||
										{}),
								},
								spacing: {
									...(block?.attributes?.style?.spacing ||
										{}),
									padding: {
										top: '0px',
										...(block?.attributes?.style?.spacing
											?.padding || {}),
									},
									margin: {
										top: '0px',
										bottom: '5px',
										...(block?.attributes?.style?.spacing
											?.margin || {}),
									},
								},
							},
						},
					]);
					break;
				case 'surecart/product-item-price':
					const price = [
						'core/group',
						{
							style: {
								spacing: {
									blockGap: '0.5em',
									margin: { top: '0px', bottom: '0px' },
								},
								margin: { top: '0px', bottom: '0px' },
							},
							layout: { type: 'flex', flexWrap: 'nowrap' },
						},
						[
							['surecart/product-list-price', block.attributes],
							[
								'surecart/product-scratch-price',
								block.attributes,
							],
						],
					];
					acc.push(price);
					break;
				case 'surecart/product-item-image':
					const image = [
						'core/group',
						{
							style: {
								color: { background: '#0000000d' },
								border: { radius: '10px' },
								spacing: {
									padding: {
										top: '0px',
										bottom: '0px',
										left: '0px',
										right: '0px',
									},
									margin: { top: '0px', bottom: '0px' },
								},
							},
						},
						[
							[
								'core/cover',
								{
									useFeaturedImage: true,
									dimRatio: 0,
									isUserOverlayColor: true,
									focalPoint: { x: 0.5, y: 0.5 },
									contentPosition: 'top right',
									isDark: false,
									layout: { type: 'default' },
									...(block?.attributes || {}),
									style: {
										...(block?.attributes?.style || {}),
										dimensions: {
											aspectRatio:
												block.attributes?.ratio ||
												'3/4',
										},
										spacing: {
											margin: {
												top: '0px',
												bottom: '15px',
											},
										},
										layout: {
											selfStretch: 'fit',
											flexSize: null,
											...(block?.attributes?.layout ||
												{}),
										},
										border: {
											radius: '10px',
											...(block?.attributes?.style
												?.border || {}),
										},
									},
								},
								[
									[
										'surecart/product-sale-badge',
										{
											style: {
												typography: {
													fontSize: '12px',
												},
												border: { radius: '100px' },
											},
										},
									],
								],
							],
						],
					];
					acc.push(image);
					break;
			}
			return acc;
		},
		[]
	);

	return [
		(!!sort_enabled || !!collection_enabled || !!search_enabled) &&
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						justifyContent: 'space-between',
					},
					style: {
						spacing: {
							margin: {
								bottom: '10px',
							},
						},
					},
				},
				[
					[
						'core/group',
						{
							layout: { type: 'flex', flexWrap: 'nowrap' },
						},
						[
							sort_enabled && ['surecart/product-list-sort', {}],
							collection_enabled && [
								'surecart/product-list-filter',
								{},
							],
						].filter(Boolean),
					],
					search_enabled && [
						'surecart/product-list-search',
						{
							style: {
								layout: {
									selfStretch: 'fixed',
									flexSize: '250px',
								},
							},
						},
					],
				].filter(Boolean),
			].filter(Boolean),
		collection_enabled &&
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
					},
					style: {
						spacing: {
							margin: {
								bottom: '10px',
							},
						},
					},
				},
				collection_enabled && [['surecart/product-list-filter-tags']],
			].filter(Boolean),
		[
			'surecart/product-template',
			{
				layout: {
					type: 'grid',
					columnCount: columns,
				},
				...attributes,
			},
			[
				[
					'core/group',
					{
						style: { spacing: { blockGap: '0' } },
						...childBlocks[0]?.attributes,
					}, // Product Item
					templateChildBlocks,
				],
			],
		],
		pagination_enabled && [
			'surecart/product-pagination',
			attributes?.pagination_size && {
				style: {
					typography: {
						fontSize: attributes?.pagination_size,
					},
				},
			},
		],
		[
			'surecart/product-list-no-products',
			{},
			[
				[
					'core/paragraph',
					{
						placeholder: __(
							'Add text or blocks that will display when a query returns no products.',
							'surecart'
						),
						align: 'center',
						content: __('No products found.', 'surecart'),
					},
				],
			],
		],
	].filter(Boolean);
};
