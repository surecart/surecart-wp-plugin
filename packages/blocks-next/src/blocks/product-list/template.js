export const TEMPLATE = [
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
					['surecart/product-list-sort', {}],
					['surecart/product-list-filter', {}],
				],
			],
			[
				'core/group',
				{
					layout: { type: 'flex', flexWrap: 'nowrap' },
				},
				[['surecart/product-list-search', {}]],
			],
		],
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
		[['surecart/product-list-filter-tags']],
	],
	['surecart/product-template'],
	['surecart/product-pagination'],
];
