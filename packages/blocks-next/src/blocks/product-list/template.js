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
				'surecart/product-list-search',
				{
					style: {
						layout: { selfStretch: 'fixed', flexSize: '250px' },
					},
				},
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
		[
			[
				'surecart/product-list-filter-tags',
				{ layout: { type: 'flex', orientation: 'vertical' } },
			],
		],
	],
	[
		'surecart/product-template',
		{
			style: { spacing: { blockGap: '30px' } },
			layout: { type: 'grid', columnCount: 4 },
		},
	],
	['surecart/product-pagination'],
];
