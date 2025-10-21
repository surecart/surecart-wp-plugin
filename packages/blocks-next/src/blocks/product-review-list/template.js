import { __ } from '@wordpress/i18n';

export const TEMPLATE = [
	[
		'core/heading',
		{
			content: __('Customer Reviews', 'surecart'),
			level: 2,
		},
	],
	[
		'surecart/product-review-summary',
		{},
		[
			[
				'core/group',
				{
					style: {
						color: {
							background: '#f7f9fb',
						},
						spacing: {
							padding: {
								top: 'var:preset|spacing|60',
								bottom: 'var:preset|spacing|60',
								left: 'var:preset|spacing|60',
								right: 'var:preset|spacing|60',
							},
							margin: {
								bottom: 'var:preset|spacing|50',
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
						'core/group',
						{
							style: {
								spacing: {
									padding: {
										top: 'var:preset|spacing|50',
										bottom: 'var:preset|spacing|50',
										left: 'var:preset|spacing|50',
										right: 'var:preset|spacing|50',
									},
									blockGap: 'var:preset|spacing|30',
									layout: {
										selfStretch: 'fill',
										flexSize: null,
									},
								},
							},
							layout: {
								type: 'flex',
								flexWrap: 'nowrap',
								orientation: 'vertical',
							},
						},
						[
							[
								'surecart/product-review-average-rating',
								{
									style: {
										spacing: {
											blockGap: 'var:preset|spacing|20',
										},
										layout: {
											selfStretch: 'fit',
											flexSize: null,
										},
									},
									layout: {
										type: 'flex',
										justifyContent: 'left',
										orientation: 'vertical',
									},
								},
								[
									[
										'surecart/product-review-average-rating-value',
										{
											className: 'is-style-slash',
										},
									],
									[
										'surecart/product-review-average-rating-stars',
										{},
									],
								],
							],
							[
								'core/group',
								{
									style: {
										spacing: {
											blockGap: 'var:preset|spacing|20',
										},
									},
									layout: {
										type: 'flex',
										flexWrap: 'nowrap',
									},
								},
								[
									[
										'surecart/product-review-total-rating',
										{
											className: 'is-style-plus-sign',
											style: {
												spacing: {
													blockGap:
														'var:preset|spacing|20',
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
					[
						'surecart/product-review-breakdown',
						{
							className: 'is-style-default',
							style: {
								layout: {
									selfStretch: 'fill',
									flexSize: null,
								},
							},
							layout: {
								type: 'flex',
								justifyContent: 'left',
								orientation: 'horizontal',
							},
						},
					],
				],
			],
		],
	],
	[
		'surecart/product-review-list-content-header',
		{
			style: {
				border: {
					bottom: {
						color: '#eeeeee',
						width: '1px',
					},
				},
				spacing: {
					padding: {
						top: 'var:preset|spacing|40',
						bottom: 'var:preset|spacing|40',
					},
					margin: {
						top: '0',
						bottom: '0',
					},
				},
			},
			layout: {
				type: 'flex',
				orientation: 'horizontal',
				verticalAlignment: 'top',
				flexWrap: 'nowrap',
				justifyContent: 'space-between',
			},
		},
		[
			[
				'surecart/product-review-list-sidebar-toggle',
				{
					label: 'Filters',
				},
			],
			[
				'core/group',
				{
					layout: {
						type: 'constrained',
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
								spacing: {
									blockGap: 'var:preset|spacing|30',
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
	[
		'surecart/product-review-list-content',
		{
			style: {
				spacing: {
					margin: {
						top: 'var:preset|spacing|50',
						bottom: 'var:preset|spacing|50',
					},
				},
			},
		},
		[
			[
				'surecart/product-review-list-sidebar',
				{
					style: {
						layout: {
							selfStretch: 'fixed',
							flexSize: '300px',
							type: 'flex',
							orientation: 'vertical',
						},
						position: {
							type: 'sticky',
							top: '0px',
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
								{},
							],
							[
								'surecart/product-review-list-filter-tags-template',
								{},
								[
									[
										'surecart/product-review-list-filter-tag',
										{},
									],
								],
							],
							[
								'surecart/product-review-list-filter-tags-clear-all',
								{},
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
						},
						[
							[
								'surecart/product-review-list-filter-checkboxes-label',
								{},
							],
							[
								'surecart/product-review-list-filter-checkboxes-template',
								{
									style: {
										spacing: {
											blockGap: 'var:preset|spacing|20',
										},
									},
								},
								[
									[
										'surecart/product-review-list-filter-checkbox',
										{},
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
						},
						layout: {
							selfStretch: 'fill',
							flexSize: null,
						},
					},
					layout: {
						type: 'flex',
						orientation: 'vertical',
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
											blockGap: 'var:preset|spacing|20',
											padding: {
												top: 'var:preset|spacing|40',
												bottom: 'var:preset|spacing|40',
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
									},
								},
								[
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
													style: {
														spacing: {
															blockGap:
																'var:preset|spacing|20',
														},
													},
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
													},
												},
												[
													[
														'surecart/product-review-reviewer-name',
														{
															style: {
																spacing: {
																	padding: {
																		top: '0',
																		bottom: '0',
																	},
																},
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'500',
																},
															},
														},
													],
													[
														'surecart/product-review-verified-badge',
														{
															show_label: true,
															label: 'Verified Buyer',
															icon_size: 16,
															style: {
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'400',
																},
																spacing: {
																	blockGap:
																		'var:preset|spacing|30',
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
														'2025-10-02T09:37:00.225Z',
													format: 'human-diff',
												},
											],
										],
									],
									['surecart/product-review-rating-stars', {}],
									[
										'surecart/product-review-title',
										{
											style: {
												typography: {
													fontStyle: 'normal',
													fontWeight: '700',
												},
											},
										},
									],
									['surecart/product-review-content', {}],
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
					content: __('No reviews yet, write one now?', 'surecart'),
				},
			],
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
								spacing: {
									blockGap: 'var:preset|spacing|30',
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
	[
		'surecart/product-review-pagination',
		{},
		[
			['surecart/product-review-pagination-previous'],
			['surecart/product-review-pagination-numbers'],
			['surecart/product-review-pagination-next'],
		],
	],
];
