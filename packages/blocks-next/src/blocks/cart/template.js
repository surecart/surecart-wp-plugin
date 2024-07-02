export const TEMPLATE = [
	[
		'core/group',
		{
			layout: {
				type: 'flex',
				flexWrap: 'nowrap',
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
				[['surecart/cart-header-v2', {}]],
			],
		],
		[
			[
				'core/group',
				{
					layout: { type: 'flex', flexWrap: 'nowrap' },
				},
				[['surecart/cart-items-v2', {}]],
			],
		],
	],
];
