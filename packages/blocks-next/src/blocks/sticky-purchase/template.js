export const TEMPLATE = [
	[
		'core/group',
		{
			className:
				'has-foreground-color has-text-color has-background has-link-color',
			style: {
				spacing: {
					padding: {
						top: 'var:preset|spacing|40',
						bottom: 'var:preset|spacing|40',
						left: 'var:preset|spacing|40',
						right: 'var:preset|spacing|40',
					},
					blockGap: '0',
				},
				border: {
					radius: '12px',
					color: '#e5e7eb',
					width: '1px',
				},
			},
			backgroundColor: 'white',
			layout: {
				type: 'constrained',
				contentSize: '',
			},
		},
		[
			[
				'surecart/product-page',
				{},
				[
					[
						'core/columns',
						{
							className: 'is-stacked-on-mobile',
							isStackedOnMobile: false,
						},
						[
							[
								'core/column',
								{ verticalAlignment: 'center', width: '75%' },
								[
									[
										'core/group',
										{
											layout: {
												type: 'flex',
												flexWrap: 'nowrap',
											},
										},
										[
											[
												'core/group',
												{
													layout: {
														type: 'flex',
														orientation: 'vertical',
													},
												},
												[
													[
														'core/post-featured-image',
														{
															aspectRatio: '1',
															width: '80px',
															height: '80px',
															scale: 'contain',
															overlayColor:
																'accent-5',
															style: {
																border: {
																	radius: '10px',
																},
															},
														},
													],
												],
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
														orientation: 'vertical',
													},
												},
												[
													[
														'surecart/product-title',
														{
															level: 4,
															style: {
																typography: {
																	fontSize:
																		'16px',
																	fontStyle:
																		'normal',
																	fontWeight:
																		'700',
																},
																layout: {
																	selfStretch:
																		'fill',
																	flexSize:
																		null,
																},
															},
														},
													],
													[
														'surecart/product-selected-variant',
														{
															separator: '/',
															style: {
																elements: {
																	link: {
																		color: {
																			text: '#6b7280',
																		},
																	},
																},
																color: {
																	text: '#6b7280',
																},
																typography: {
																	fontSize:
																		'16px',
																},
															},
														},
													],
													[
														'core/group',
														{
															style: {
																spacing: {
																	blockGap:
																		'0.5em',
																},
															},
															layout: {
																type: 'flex',
																flexWrap:
																	'wrap',
																justifyContent:
																	'left',
																verticalAlignment:
																	'bottom',
															},
														},
														[
															[
																'surecart/product-selected-price-scratch-amount',
																{
																	style: {
																		typography:
																			{
																				textDecoration:
																					'line-through',
																				fontSize:
																					'16px',
																				lineHeight:
																					'1.5',
																			},
																		color: {
																			text: '#686868',
																		},
																		elements:
																			{
																				link: {
																					color: {
																						text: '#686868',
																					},
																				},
																			},
																	},
																},
															],
															[
																'surecart/product-selected-price-amount',
																{
																	style: {
																		typography:
																			{
																				fontSize:
																					'16px',
																				lineHeight:
																					'1.5',
																			},
																	},
																},
															],
															[
																'surecart/product-selected-price-interval',
																{
																	style: {
																		typography:
																			{
																				lineHeight:
																					'1.5',
																				fontSize:
																					'16px',
																			},
																	},
																},
															],
														],
													],
												],
											],
										],
									],
								],
							],
							[
								'core/column',
								{ verticalAlignment: 'center', width: '25%' },
								[
									[
										'core/group',
										{
											layout: {
												type: 'flex',
												flexWrap: 'nowrap',
												justifyContent: 'right',
											},
										},
										[
											[
												'surecart/product-buy-buttons',
												{
													style: {
														spacing: {
															blockGap: '5px',
														},
													},
												},
												[
													[
														'surecart/product-buy-button',
														{
															add_to_cart: true,
															text: 'Add',
														},
													],
												],
											],
										],
									],
								],
							],
						],
					],
				],
			],
		],
	],
];
