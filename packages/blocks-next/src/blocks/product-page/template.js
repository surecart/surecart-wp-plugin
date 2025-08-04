// use pattern as template
export default [
	[
		'core/columns',
		{ style: { spacing: { blockGap: { top: '30px', left: '60px' } } } },
		[
			['core/column', { width: '50%' }, [['surecart/product-media']]],
			[
				'core/column',
				{ width: '50%' },
				[
					[
						'surecart/product-collection-tags',
						{ count: 1 },
						[['surecart/product-collection-tag']],
					],
					['surecart/product-title'],
					[
						'core/group',
						{
							style: { spacing: { blockGap: '0' } },
							layout: { type: 'constrained' },
						},
						[
							[
								'core/group',
								{
									style: { spacing: { blockGap: '0.5em' } },
									layout: {
										type: 'flex',
										flexWrap: 'nowrap',
										justifyContent: 'left',
									},
								},
								[
									[
										'surecart/product-selected-price-scratch-amount',
										{
											style: {
												typography: {
													textDecoration:
														'line-through',
													fontSize: '24px',
												},
												color: { text: '#8a8a8a' },
												elements: {
													link: {
														color: {
															text: '#8a8a8a',
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
												typography: {
													fontSize: '24px',
												},
											},
										},
									],
									[
										'surecart/product-sale-badge',
										{
											text: 'Sale',
											style: {
												border: { radius: '15px' },
												typography: {
													fontSize: '12px',
												},
												layout: {
													selfStretch: 'fit',
													flexSize: null,
												},
												elements: {
													link: {
														color: {
															text: '#fff',
														},
													},
												},
											},
											textColor: 'white',
										},
									],
								],
							],
							[
								'core/group',
								{
									style: { spacing: { blockGap: '0.5em' } },
									layout: {
										type: 'flex',
										flexWrap: 'nowrap',
									},
								},
								[
									[
										'surecart/product-selected-price-trial',
										{
											style: {
												color: { text: '#8a8a8a' },
												elements: {
													link: {
														color: {
															text: '#8a8a8a',
														},
													},
												},
											},
										},
									],
									[
										'surecart/product-selected-price-fees',
										{
											style: {
												color: { text: '#8a8a8a' },
												elements: {
													link: {
														color: {
															text: '#8a8a8a',
														},
													},
												},
											},
										},
									],
								],
							],
						],
					],
					['surecart/product-description'],
					[
						'surecart/product-variant-pills',
						[
							[
								'surecart/product-variant-pills-wrapper',
								[['surecart/product-variant-pill']],
							],
						],
					],
					[
						'surecart/product-price-chooser',
						[
							[
								'surecart/product-price-choice-template',
								{
									layout: {
										type: 'flex',
										justifyContent: 'left',
										flexWrap: 'nowrap',
										orientation: 'vertical',
									},
								},
								[
									['surecart/price-name'],
									[
										'core/group',
										{
											style: {
												spacing: {
													blockGap: '0px',
												},
											},
											layout: {
												type: 'flex',
												orientation: 'vertical',
												justifyContent: 'right',
											},
										},
										[
											[
												'core/group',
												{
													style: {
														spacing: {
															blockGap: '0.5rem',
														},
													},
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
														justifyContent: 'left',
													},
												},
												[
													[
														'surecart/price-scratch-amount',
														{
															style: {
																elements: {
																	link: {
																		color: {
																			text: '#686868',
																		},
																	},
																},
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'700',
																	textDecoration:
																		'line-through',
																},
															},
															textColor:
																'#686868',
														},
														[],
													],
													[
														'surecart/price-amount',
														{
															style: {
																elements: {
																	link: {
																		color: {
																			text: 'var:preset|color|accent-3',
																		},
																	},
																},
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'700',
																},
															},
															textColor:
																'accent-3',
														},
														[],
													],
													[
														'surecart/price-interval',
														{
															style: {
																elements: {
																	link: {
																		color: {
																			text: 'var:preset|color|accent-3',
																		},
																	},
																},
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'700',
																},
															},
															textColor:
																'accent-3',
														},
														[],
													],
												],
											],
											[
												'surecart/price-trial',
												{
													style: {
														color: {
															text: '#8a8a8a',
														},
														elements: {
															link: {
																color: {
																	text: '#8a8a8a',
																},
															},
														},
													},
													fontSize: 'small',
												},
											],
											[
												'surecart/price-setup-fee',
												{
													style: {
														color: {
															text: '#8a8a8a',
														},
														elements: {
															link: {
																color: {
																	text: '#8a8a8a',
																},
															},
														},
													},
													fontSize: 'small',
												},
											],
										],
									],
								],
							],
						],
					],
					['surecart/product-quantity'],
					['surecart/product-selected-price-ad-hoc-amount'],
					['surecart/product-line-item-note'],
					[
						'surecart/product-buy-buttons',
						{
							class: 'wp-block-surecart-product-buy-buttons wp-block-buttons sc-block-buttons is-layout-flex',
						},
						[
							[
								'surecart/product-buy-button',
								{ add_to_cart: true, text: 'Add To Cart' },
							],
							[
								'surecart/product-buy-button',
								{ text: 'Buy Now', style: 'outline' },
							],
						],
					],
				],
			],
		],
	],
];
