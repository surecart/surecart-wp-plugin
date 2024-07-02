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
						{ ...block.attributes, level: 0 },
					]);
					break;
				case 'surecart/product-item-price':
					acc.push(['surecart/product-list-price', block.attributes]);
					break;
				case 'surecart/product-item-image':
					acc.push(['surecart/product-image', block.attributes]);
					break;
			}
			return acc;
		},
		[]
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
						sort_enabled && ['surecart/product-list-sort', {}],
						collection_enabled && [
							'surecart/product-list-filter',
							{},
						],
					].filter(Boolean),
				],
				search_enabled && [
					'core/group',
					{
						layout: { type: 'flex', flexWrap: 'nowrap' },
					},
					[['surecart/product-list-search', {}]],
				],
			].filter(Boolean),
		],
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
			},
			[
				[
					'core/group',
					childBlocks[0]?.attributes, // Product Item
					templateChildBlocks,
				],
			],
		],
		pagination_enabled && ['surecart/product-pagination'],
	].filter(Boolean);
};
