export default [
	[
		'core/group',
		{
			style: {
				layout: { selfStretch: 'fill', flexSize: null },
				dimensions: { minHeight: '200px' },
			},
			layout: { type: 'default' },
		},
		[
			[
				'core/group',
				{
					style: {
						layout: { selfStretch: 'fit', flexSize: null },
					},
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						verticalAlignment: 'stretch',
					},
				},
				[
					[
						'surecart/cart-line-item-image',
						{
							id: 3546,
							width: '114px',
							height: '114px',
							scale: 'cover',
							sizeSlug: 'large',
							linkDestination: 'none',
							style: {
								layout: {
									selfStretch: 'fixed',
									flexSize: '114px',
								},
								border: {
									radius: '4px',
									width: '1px',
								},
								shadow: 'none',
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
							},
							layout: {
								type: 'flex',
								orientation: 'vertical',
								justifyContent: 'stretch',
								flexWrap: 'nowrap',
								verticalAlignment: 'top',
							},
						},
						[
							[
								'core/group',
								{
									style: {
										layout: {
											selfStretch: 'fill',
											flexSize: null,
										},
									},
									layout: { type: 'default' },
								},
								[
									[
										'core/group',
										{
											style: {
												layout: {
													selfStretch: 'fill',
													flexSize: null,
												},
											},
											layout: {
												type: 'flex',
												flexWrap: 'nowrap',
												verticalAlignment: 'stretch',
												justifyContent: 'space-between',
											},
										},
										[
											[
												'core/group',
												{
													style: {
														layout: {
															selfStretch:
																'fixed',
															flexSize: '50%',
														},
														spacing: {
															blockGap: '10px',
														},
													},
													layout: {
														type: 'default',
													},
												},
												[
													[
														'core/paragraph',
														{
															style: {
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
															},
															content:
																'<strong>Cloudnova</strong>',
														},
													],
													[
														'core/paragraph',
														{
															style: {
																typography: {
																	fontSize:
																		'14px',
																	lineHeight:
																		'1.4',
																},
																color: {
																	text: '#828c99',
																},
																elements: {
																	link: {
																		color: {
																			text: '#828c99',
																		},
																	},
																},
															},
															content:
																'Black / S<br>One Time',
														},
													],
												],
											],
											[
												'core/group',
												{
													style: {
														layout: {
															selfStretch: 'fit',
															flexSize: null,
														},
														spacing: {
															blockGap: '10px',
														},
													},
													layout: {
														type: 'default',
													},
												},
												[
													[
														'core/paragraph',
														{
															align: 'right',
															style: {
																layout: {
																	selfStretch:
																		'fill',
																	flexSize:
																		null,
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
															},
															content:
																'<strong>$10</strong> / mo',
														},
													],
													[
														'core/paragraph',
														{
															align: 'right',
															style: {
																layout: {
																	selfStretch:
																		'fill',
																	flexSize:
																		null,
																},
																typography: {
																	fontSize:
																		'14px',
																	lineHeight:
																		'1.4',
																},
																color: {
																	text: '#828c99',
																},
																elements: {
																	link: {
																		color: {
																			text: '#828c99',
																		},
																	},
																},
															},
															content:
																'$99 Setup Fee<br>14 Day Free Trial',
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
									layout: {
										type: 'flex',
										flexWrap: 'nowrap',
										justifyContent: 'space-between',
										verticalAlignment: 'center',
									},
								},
								[
									[
										'core/group',
										{
											style: {
												layout: {
													selfStretch: 'fill',
													flexSize: null,
												},
											},
											layout: { type: 'default' },
										},
										[
											[
												'core/paragraph',
												{
													style: {
														layout: {
															selfStretch: 'fill',
															flexSize: null,
														},
													},
													content: 'Qty',
												},
											],
										],
									],
									[
										'core/group',
										{
											style: {
												layout: {
													selfStretch: 'fit',
													flexSize: null,
												},
											},
											layout: { type: 'default' },
										},
										[
											[
												'core/paragraph',
												{
													style: {
														layout: {
															selfStretch: 'fit',
															flexSize: null,
														},
													},
													content: 'Remove',
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
];
