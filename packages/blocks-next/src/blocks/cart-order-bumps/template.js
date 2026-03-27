import { __ } from '@wordpress/i18n';
export const TEMPLATE = [
	[
		'core/group',
		{
			style: {
				spacing: {
					margin: {
						bottom: '0.75em',
					},
				},
			},
			layout: {
				type: 'flex',
				flexWrap: 'nowrap',
				justifyContent: 'space-between',
				verticalAlignment: 'center',
			},
		},
		[
			[
				'core/paragraph',
				{
					style: {
						typography: {
							fontStyle: 'normal',
							fontWeight: '500',
						},
						spacing: {
							margin: {
								top: '0',
								bottom: '0',
							},
						},
					},
					content: __('Suggested for you', 'surecart'),
				},
			],
			[
				'surecart/cart-order-bump-pagination',
				{
					style: {
						spacing: {
							blockGap: '0.25em',
						},
					},
				},
				[
					['surecart/cart-order-bump-pagination-previous', {}],
					['surecart/cart-order-bump-pagination-next', {}],
				],
			],
		],
	],
	[
		'surecart/cart-order-bump-template',
		{
			style: {
				spacing: {
					blockGap: '0.75em',
				},
			},
			layout: {
				type: 'flex',
			},
		},
		[
			[
				'core/group',
				{
					style: {
						border: {
							radius: '12px',
							width: '1px',
							color: '#e0e0e0',
						},
						spacing: {
							padding: {
								top: '0.75em',
								bottom: '0.75em',
								left: '0.75em',
								right: '1em',
							},
						},
						layout: {
							selfStretch: 'fill',
							flexSize: null,
						},
					},
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						verticalAlignment: 'center',
					},
				},
				[
					[
						'surecart/cart-order-bump-image',
						{
							width: '72px',
							style: {
								border: {
									radius: '8px',
								},
								layout: {
									selfStretch: 'fixed',
									flexSize: '72px',
								},
							},
						},
					],
					[
						'core/group',
						{
							style: {
								layout: {
									selfStretch: 'fill',
									flexSize: null,
								},
								spacing: {
									blockGap: '2px',
								},
							},
							layout: {
								type: 'flex',
								orientation: 'vertical',
							},
						},
						[
							[
								'surecart/cart-order-bump-title',
								{
									style: {
										typography: {
											fontSize: '15px',
											fontStyle: 'normal',
											fontWeight: '600',
											lineHeight: '1.3',
										},
									},
								},
							],
							[
								'surecart/cart-order-bump-description',
								{
									style: {
										typography: {
											fontSize: '13px',
											lineHeight: '1.3',
										},
										color: {
											text: '#6b7280',
										},
									},
								},
							],
							[
								'core/group',
								{
									style: {
										spacing: {
											blockGap: '4px',
										},
									},
									layout: {
										type: 'flex',
										flexWrap: 'nowrap',
									},
								},
								[
									[
										'surecart/cart-order-bump-scratch-amount',
										{
											style: {
												typography: {
													fontSize: '14px',
												},
											},
										},
									],
									[
										'surecart/cart-order-bump-amount',
										{
											style: {
												typography: {
													fontSize: '14px',
													fontWeight: '500',
												},
											},
										},
									],
								],
							],
						],
					],
					[
						'surecart/cart-order-bump-add-button',
						{
							style: {
								typography: {
									fontSize: '18px',
									fontWeight: '400',
									fontStyle: 'normal',
								},
								border: {
									radius: {
										topLeft: '74.6%',
										topRight: '74.6%',
										bottomLeft: '74.6%',
										bottomRight: '74.6%',
									},
									width: '1px',
									color: '#d1d5db',
								},
								spacing: {
									padding: {
										top: '0.5em',
										bottom: '0.5em',
										left: '0.5em',
										right: '0.5em',
									},
								},
							},
						},
					],
				],
			],
		],
	],
];
