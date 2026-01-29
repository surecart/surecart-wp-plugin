import { __ } from '@wordpress/i18n';

export const TEMPLATE = [
	[
		'core/heading',
		{
			content: __('Customer Reviews', 'surecart'),
			level: 2,
			className: 'wp-block-heading',
			style: {
				spacing: {
					margin: {
						top: '32px',
						bottom: '32px',
					},
				},
				typography: {
					lineHeight: '1',
				},
			},
		},
	],
	[
		'surecart/product-reviews',
		{},
		[
			[
				'surecart/product-review-summary',
				{
					style: {
						spacing: {
							margin: {
								bottom: '15px',
							},
						},
					},
				},
				[
					[
						'core/columns',
						{
							style: {
								spacing: {
									blockGap: {
										left: '20px',
									},
								},
							},
						},
						[
							[
								'core/column',
								{
									verticalAlignment: 'center',
									width: '280px',
								},
								[
									[
										'core/group',
										{
											style: {
												spacing: {
													blockGap: '14px',
													padding: {
														right: '0px',
														left: '0px',
													},
													margin: {
														top: '0',
														bottom: '0',
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
												orientation: 'vertical',
												verticalAlignment: 'center',
											},
										},
										[
											[
												'core/group',
												{
													style: {
														spacing: {
															blockGap: '5px',
															padding: {
																right: '0px',
																left: '0px',
															},
															margin: {
																top: '0',
																bottom: '0',
															},
														},
													},
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
														verticalAlignment:
															'bottom',
													},
												},
												[
													[
														'surecart/product-review-average-rating-value',
														{
															className:
																'is-style-none',
															style: {
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'600',
																	lineHeight:
																		'1',
																	fontSize:
																		'24px',
																},
															},
														},
													],
													[
														'core/paragraph',
														{
															content: '/ 5.0',
															metadata: {
																name: '/ 5.0',
															},
															style: {
																typography: {
																	lineHeight:
																		'1.5',
																	fontSize:
																		'14px',
																},
																color: {
																	text: '#4b5563',
																},
																elements: {
																	link: {
																		color: {
																			text: '#4b5563',
																		},
																	},
																},
																spacing: {
																	padding: {
																		top: '0',
																		bottom: '0',
																		left: '0',
																		right: '0',
																	},
																	margin: {
																		top: '0',
																		bottom: '0',
																	},
																},
															},
														},
													],
												],
											],
											[
												'surecart/product-review-average-rating-stars',
												{},
											],
											[
												'core/group',
												{
													style: {
														spacing: {
															blockGap: '5px',
															padding: {
																right: '0px',
																left: '0px',
															},
															margin: {
																top: '0',
																bottom: '0',
															},
														},
													},
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
													},
												},
												[
													[
														'core/paragraph',
														{
															content: __(
																'Based on',
																'surecart'
															),
															metadata: {
																name: 'Based on',
															},
															style: {
																typography: {
																	fontSize:
																		'14px',
																},
																spacing: {
																	padding: {
																		top: '0',
																		bottom: '0',
																		left: '0',
																		right: '0',
																	},
																	margin: {
																		top: '0',
																		bottom: '0',
																	},
																},
															},
														},
													],
													[
														'surecart/product-review-total-rating',
														{
															link_to_reviews: false,
															className:
																'is-style-default',
															style: {
																spacing: {
																	blockGap:
																		'4px',
																	margin: {
																		right: '0',
																		left: '0',
																	},
																	padding: {
																		right: '0',
																		left: '0',
																	},
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
							[
								'core/column',
								{
									verticalAlignment: 'center',
								},
								[
									[
										'surecart/product-review-breakdown',
										{
											columns: 2,
											className: 'is-style-default',
											layout: {
												type: 'flex',
												justifyContent: 'left',
												orientation: 'horizontal',
												verticalAlignment: 'center',
											},
										},
									],
								],
							],
						],
					],
				],
			],
			[
				'core/group',
				{
					metadata: {
						name: 'Header',
					},
					style: {
						spacing: {
							margin: {
								bottom: '10px',
							},
							padding: {
								top: '0',
								bottom: '0',
								left: '0',
								right: '0',
							},
						},
					},
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'space-between',
					},
				},
				[
					[
						'surecart/product-review-list-sidebar-toggle',
						{
							label: __('Filters', 'surecart'),
						},
					],
					[
						'surecart/product-review-add-button',
						{
							width: 100,
							className: 'is-style-fill',
							style: {
								elements: {
									link: {
										color: {
											text: 'var:preset|color|white',
										},
									},
								},
							},
							backgroundColor: 'surecart',
							textColor: 'white',
						},
					],
				],
			],
			[
				'core/group',
				{
					style: {
						spacing: {
							padding: {
								right: '0px',
								left: '0px',
							},
							margin: {
								top: '0',
								bottom: '0',
							},
						},
					},
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						verticalAlignment: 'top',
					},
				},
				[
					[
						'surecart/product-review-list-sidebar',
						{
							style: {
								layout: {
									selfStretch: 'fixed',
									flexSize: '225px',
								},
								position: {
									type: 'sticky',
									top: '0px',
								},
								spacing: {
									blockGap: '30px',
								},
							},
							layout: {
								type: 'flex',
								orientation: 'vertical',
							},
						},
						[
							[
								'surecart/product-review-list-filter-tags',
								{
									layout: {
										type: 'flex',
										orientation: 'vertical',
										verticalAlignment: 'top',
										flexWrap: 'nowrap',
									},
								},
								[
									[
										'surecart/product-review-list-filter-tags-label',
										{
											style: {
												typography: {
													fontWeight: '700',
													fontStyle: 'normal',
													fontSize: '16px',
												},
											},
										},
									],
									[
										'surecart/product-review-list-filter-tags-template',
										{
											layout: {
												type: 'flex',
												orientation: 'horizontal',
											},
											style: {
												spacing: {
													blockGap: '8px',
												},
												typography: {
													fontSize: '16px',
												},
											},
										},
										[
											[
												'surecart/product-review-list-filter-tag',
												{
													style: {
														typography: {
															fontSize: '14px',
														},
													},
												},
											],
										],
									],
									[
										'surecart/product-review-list-filter-tags-clear-all',
										{
											style: {
												typography: {
													textDecoration: 'underline',
													fontWeight: '700',
													fontStyle: 'normal',
												},
											},
											fontSize: 'small',
										},
									],
								],
							],
							[
								'surecart/product-review-list-filter-checkboxes',
								{
									layout: {
										type: 'flex',
										orientation: 'vertical',
										verticalAlignment: 'top',
										flexWrap: 'nowrap',
									},
									style: {
										spacing: {
											blockGap: '8px',
										},
									},
								},
								[
									[
										'surecart/product-review-list-filter-checkboxes-label',
										{
											style: {
												typography: {
													fontWeight: '700',
													fontStyle: 'normal',
													fontSize: '16px',
												},
											},
										},
									],
									[
										'surecart/product-review-list-filter-checkboxes-template',
										{
											style: {
												spacing: {
													blockGap: '6px',
													margin: {
														top: '0',
														bottom: '0',
													},
												},
												typography: {
													fontSize: '16px',
												},
											},
										},
										[
											[
												'surecart/product-review-list-filter-checkbox',
												{
													style: {
														typography: {
															fontSize: '16px',
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
					[
						'core/group',
						{
							style: {
								spacing: {
									blockGap: '0px',
									padding: {
										right: '0px',
										left: '0px',
									},
									margin: {
										top: '0',
										bottom: '0',
									},
								},
								layout: {
									selfStretch: 'fill',
									flexSize: null,
								},
							},
							layout: {
								type: 'flex',
								orientation: 'vertical',
								justifyContent: 'stretch',
							},
						},
						[
							[
								'surecart/product-review-template',
								{
									style: {
										spacing: {
											blockGap: '0px',
											margin: {
												top: '0',
												bottom: '0',
											},
											padding: {
												top: '0',
												bottom: '0',
											},
										},
									},
									layout: {
										type: 'grid',
										columnCount: 1,
									},
								},
								[
									[
										'core/group',
										{
											style: {
												spacing: {
													blockGap: '8px',
													padding: {
														top: '24px',
														bottom: '24px',
														right: '0px',
														left: '0px',
													},
													margin: {
														top: '0',
														bottom: '0',
													},
												},
												border: {
													bottom: {
														color: '#e5e7eb',
														width: '1px',
													},
												},
											},
											layout: {
												type: 'constrained',
												contentSize: '100%',
											},
										},
										[
											[
												'core/group',
												{
													className:
														'sc-review-header-group',
													style: {
														spacing: {
															margin: {
																top: '0',
																bottom: '16px',
															},
															padding: {
																right: '0px',
																left: '0px',
															},
														},
													},
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
														justifyContent:
															'space-between',
													},
												},
												[
													[
														'core/group',
														{
															style: {
																spacing: {
																	blockGap:
																		'8px',
																	padding: {
																		right: '0px',
																		left: '0px',
																	},
																	margin: {
																		top: '0',
																		bottom: '0',
																	},
																},
															},
															layout: {
																type: 'flex',
																flexWrap:
																	'nowrap',
															},
														},
														[
															[
																'surecart/product-review-reviewer-name',
																{
																	style: {
																		spacing:
																			{
																				padding:
																					{
																						top: '0',
																						bottom: '0',
																					},
																				margin: {
																					right: '8px',
																				},
																			},
																		typography:
																			{
																				fontStyle:
																					'normal',
																				fontWeight:
																					'500',
																				fontSize:
																					'16px',
																			},
																	},
																},
															],
															[
																'surecart/product-review-verified-badge',
																{
																	label: __(
																		'Verified Buyer',
																		'surecart'
																	),
																	style: {
																		typography:
																			{
																				fontStyle:
																					'normal',
																				fontWeight:
																					'400',
																				fontSize:
																					'16px',
																			},
																		spacing:
																			{
																				blockGap:
																					'4px',
																			},
																		layout: {
																			selfStretch:
																				'fit',
																			flexSize:
																				null,
																		},
																	},
																	layout: {
																		type: 'flex',
																		justifyContent:
																			'center',
																		verticalAlignment:
																			'center',
																		orientation:
																			'horizontal',
																	},
																},
															],
														],
													],
													[
														'surecart/product-review-date',
														{
															datetime:
																'2026-01-01T09:37:00.225Z',
															format: 'human-diff',
															style: {
																typography: {
																	fontSize:
																		'14px',
																},
															},
														},
													],
												],
											],
											[
												'surecart/product-review-rating-stars',
												{
													style: {
														spacing: {
															margin: {
																bottom: '16px',
															},
														},
													},
												},
											],
											[
												'surecart/product-review-title',
												{
													style: {
														typography: {
															fontStyle: 'normal',
															fontWeight: '700',
															fontSize: '18px',
														},
														spacing: {
															margin: {
																bottom: '8px',
															},
														},
													},
												},
											],
											[
												'surecart/product-review-content',
												{
													style: {
														typography: {
															fontSize: '16px',
														},
													},
												},
											],
										],
									],
								],
							],
							[
								'surecart/product-review-pagination',
								{
									style: {
										spacing: {
											margin: {
												top: '30px',
												bottom: '30px',
											},
										},
									},
								},
								[
									[
										'surecart/product-review-pagination-previous',
										{},
									],
									[
										'surecart/product-review-pagination-numbers',
										{},
									],
									[
										'surecart/product-review-pagination-next',
										{},
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
		'surecart/product-review-list-no-reviews',
		{},
		[
			[
				'core/paragraph',
				{
					align: 'left',
					placeholder: __(
						'Add text or blocks that will display when a query returns no reviews.',
						'surecart'
					),
					content: __('No reviews yet.', 'surecart'),
				},
			],
			[
				'core/group',
				{
					style: {
						spacing: {
							padding: {
								right: '0px',
								left: '0px',
							},
							margin: {
								top: '0',
								bottom: '0',
							},
						},
					},
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
					},
				},
				[
					[
						'surecart/product-review-add-button',
						{
							width: 100,
							className: 'is-style-fill',
							style: {
								elements: {
									link: {
										color: {
											text: 'var:preset|color|white',
										},
									},
								},
							},
							backgroundColor: 'surecart',
							textColor: 'white',
						},
					],
				],
			],
		],
	],
];
