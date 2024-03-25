export const TEMPLATE = [
	[
		'core/group',
		{
			layout: {
				type: 'flex',
				flexWrap: 'nowrap',
				justifyContent: 'space-between',
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
	['surecart/product-template'],
	['surecart/product-pagination'],
];
