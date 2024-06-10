export const newShopTemplate = (attributes, childBlocks) => {
	const {
		sort_enabled,
		search_enabled,
		pagination_enabled,
		collection_enabled,
		columns,
	} = attributes;

	const getChildBlocksAttributes = (blockName) => {
		return childBlocks[0]?.innerBlocks.find(
			(block) => block.name === blockName
		)?.attributes;
	};

	const blockNames = [
		'surecart/product-item-title',
		'surecart/product-item-price',
		'surecart/product-item-image',
	];

	const [titleAttributes, priceAttributes, imageAttributes] = blockNames.map(
		getChildBlocksAttributes
	);

	return [
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
						sort_enabled
							? ['surecart/product-list-sort', {}]
							: null,
						collection_enabled
							? ['surecart/product-list-filter', {}]
							: null,
					].filter(Boolean),
				],
				search_enabled
					? [
							'core/group',
							{
								layout: { type: 'flex', flexWrap: 'nowrap' },
							},
							[['surecart/product-list-search', {}]],
					  ]
					: null,
			].filter(Boolean),
		],
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
			collection_enabled ? [['surecart/product-list-filter-tags']] : null,
		].filter(Boolean),
		[
			'surecart/product-template',
			{
				layout: {
					type: 'grid',
					columnCount: columns,
				},
			},
			[
				[
					'core/group',
					childBlocks[0]?.attributes, // Product Item
					[
						['surecart/product-image', imageAttributes],
						[
							'surecart/product-title-v2',
							{
								...titleAttributes,
								level: 0,
							},
						],
						['surecart/product-price-v2', priceAttributes],
					],
				],
			],
		],
		pagination_enabled ? ['surecart/product-pagination'] : null,
	].filter(Boolean);
};
