import { __ } from '@wordpress/i18n';

export const TEMPLATE = [
	[
		'core/heading',
		{
			content: __('Customer Reviews', 'surecart'),
			level: 2,
		},
	],
	['surecart/product-review-summary'],
	[
		'core/group',
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
						top: 'var:preset|spacing|30',
						bottom: 'var:preset|spacing|30',
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
				'core/group',
				{
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'left',
						orientation: 'horizontal',
					},
				},
				[
					[
						'surecart/product-review-list-sidebar-toggle',
						{ label: 'Filters' },
					],
				],
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
						'surecart/review-add-button',
						{
							label: 'Write a Review',
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
		'surecart/product-review-list-filter-tags',
		{},
		[['surecart/product-review-list-filter-tag', {}]],
		['surecart/product-review-list-sort', {}],
	],
	[
		'surecart/product-review-list-content',
		{},
		[
			[
				'surecart/product-review-list-sidebar',
				{
					label: 'Filters',
					style: {
						layout: {
							selfStretch: 'fixed',
							flexSize: '300px',
							type: 'flex',
							orientation: 'vertical',
						},
					},
					layout: {
						type: 'flex',
						orientation: 'vertical',
					},
				},
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
														'surecart/review-reviewer-name',
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
														'surecart/review-verified-badge',
														{
															label: 'Verified Buyer',
															icon_size: 17,
															style: {
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'400',
																},
																color: {
																	text: '#6b7280',
																},
																elements: {
																	link: {
																		color: {
																			text: '#6b7280',
																		},
																	},
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
												'surecart/review-date',
												{
													datetime:
														'2025-10-02T09:37:00.225Z',
													format: 'human-diff',
												},
											],
										],
									],
									['surecart/review-rating-stars', {}],
									[
										'surecart/review-title',
										{
											style: {
												typography: {
													fontStyle: 'normal',
													fontWeight: '700',
												},
											},
										},
									],
									['surecart/review-content', {}],
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
						'surecart/review-add-button',
						{
							label: 'Write a Review',
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
];
