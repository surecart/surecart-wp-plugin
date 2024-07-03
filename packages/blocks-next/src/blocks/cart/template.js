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
				[['surecart/slide-out-cart-header', {}]],
			],
		],
		[
			[
				'core/group',
				{
					layout: { type: 'flex', flexWrap: 'nowrap' },
				},
				[['surecart/slide-out-cart-items', {}]],
			],
		],
	],
];
