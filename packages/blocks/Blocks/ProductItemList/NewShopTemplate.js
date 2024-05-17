export const newShopTemplate = (attributes) => {
	const {
		sort_enabled,
		search_enabled,
		pagination_enabled,
		collection_enabled,
		columns,
	} = attributes;

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
		],
		pagination_enabled ? ['surecart/product-pagination'] : null,
	].filter(Boolean);
};
