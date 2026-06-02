export const TEMPLATE = [
	[
		'core/group',
		{
			style: {
				spacing: {
					padding: {
						top: '1.5em',
						bottom: '0em',
						left: '2em',
						right: '2em',
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
				'surecart/cart-close-button',
				{
					style: {
						typography: { lineHeight: '1' },
					},
				},
			],
			[
				'core/paragraph',
				{
					style: {
						typography: {
							fontSize: '16px',
							lineHeight: '1',
							fontStyle: 'normal',
							fontWeight: '500',
						},
						spacing: {
							padding: {
								top: '0px',
								bottom: '0px',
								left: '0px',
								right: '0px',
							},
							margin: {
								top: '0px',
								bottom: '0px',
								left: '0px',
								right: '0px',
							},
						},
					},
					content: 'Review My Order',
				},
			],
			[
				'surecart/cart-count',
				{
					style: {
						layout: { selfStretch: 'fit', flexSize: null },
						typography: {
							lineHeight: '1',
							fontWeight: '600',
							fontSize: '14px',
							fontStyle: 'normal',
						},
						spacing: {
							padding: {
								top: '6px',
								bottom: '6px',
								left: '10px',
								right: '10px',
							},
						},
						border: { radius: '4px' },
					},
				},
			],
		],
	],
	[
		'core/group',
		{
			style: {
				layout: { selfStretch: 'fill', flexSize: null },
			},
			layout: { type: 'default' },
		},
		[
			[
				'surecart/slide-out-cart-line-items',
				{
					border: false,
					padding: {
						top: '0em',
						right: '0em',
						bottom: '0em',
						left: '0em',
					},
					metadata: {
						ignoredHookedBlocks: [
							'surecart/cart-line-item-divider',
						],
					},
					style: {
						spacing: {
							padding: {
								top: '2em',
								bottom: '2em',
								left: '2em',
								right: '2em',
							},
							blockGap: '2em',
						},
					},
				},
				[
					[
						'core/group',
						{
							style: {
								layout: { selfStretch: 'fill', flexSize: null },
								dimensions: { minHeight: '' },
							},
							layout: { type: 'default' },
						},
						[
							[
								'core/group',
								{
									style: {
										layout: {
											selfStretch: 'fit',
											flexSize: null,
										},
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
											aspectRatio: '1',
											width: '',
											height: '',
											style: {
												layout: {
													selfStretch: 'fixed',
													flexSize: '80px',
												},
												border: {
													width: '1px',
													radius: '4px',
												},
												color: { duotone: 'unset' },
												spacing: {
													margin: {
														top: '0',
														bottom: '0',
													},
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
												spacing: { blockGap: '5px' },
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
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
														verticalAlignment:
															'stretch',
														justifyContent:
															'space-between',
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
																	flexSize:
																		'50%',
																},
																spacing: {
																	blockGap:
																		'0px',
																},
															},
															layout: {
																type: 'default',
															},
														},
														[
															[
																'surecart/cart-line-item-title',
																{
																	style: {
																		typography:
																			{
																				fontStyle:
																					'normal',
																				fontWeight:
																					'500',
																				lineHeight:
																					'1.4',
																				textDecoration:
																					'none',
																			},
																	},
																},
															],
															[
																'core/group',
																{
																	style: {
																		spacing:
																			{
																				blockGap:
																					'0px',
																			},
																	},
																	layout: {
																		type: 'default',
																	},
																},
																[
																	[
																		'surecart/cart-line-item-price-name',
																		{
																			style: {
																				typography:
																					{
																						fontSize:
																							'14px',
																						lineHeight:
																							'1.4',
																					},
																			},
																		},
																	],
																	[
																		'surecart/cart-line-item-variant',
																		{
																			style: {
																				typography:
																					{
																						fontSize:
																							'14px',
																						lineHeight:
																							'1.4',
																					},
																			},
																		},
																	],
																	[
																		'surecart/cart-line-item-details',
																		{},
																		[
																			[
																				'surecart/cart-line-item-bundle-components',
																				{
																					style: {
																						color: {
																							text: '#828c99',
																						},
																						elements:
																							{
																								link: {
																									color: {
																										text: '#828c99',
																									},
																								},
																							},
																						typography:
																							{
																								fontSize:
																									'14px',
																								lineHeight:
																									'1.4',
																							},
																					},
																				},
																			],
																			[
																				'surecart/cart-line-item-note',
																				{
																					style: {
																						typography:
																							{
																								fontSize:
																									'14px',
																								lineHeight:
																									'1.4',
																							},
																					},
																				},
																			],
																		],
																	],
																],
															],
															[
																'surecart/cart-line-item-status',
																{
																	style: {
																		typography:
																			{
																				textAlign:
																					'right',
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
																layout: {
																	selfStretch:
																		'fit',
																	flexSize:
																		null,
																},
																spacing: {
																	blockGap:
																		'0px',
																},
															},
															layout: {
																type: 'default',
															},
														},
														[
															[
																'core/group',
																{
																	style: {
																		spacing:
																			{
																				blockGap:
																					'4px',
																			},
																		typography:
																			{
																				lineHeight:
																					'1.4',
																			},
																	},
																	layout: {
																		type: 'flex',
																		flexWrap:
																			'nowrap',
																		justifyContent:
																			'right',
																	},
																},
																[
																	[
																		'surecart/cart-line-item-scratch-amount',
																		{},
																	],
																	[
																		'surecart/cart-line-item-amount',
																		{
																			style: {
																				typography:
																					{
																						fontStyle:
																							'normal',
																						fontWeight:
																							'500',
																						textAlign:
																							'right',
																					},
																			},
																		},
																	],
																	[
																		'surecart/cart-line-item-interval',
																		{
																			style: {
																				typography:
																					{
																						fontSize:
																							'14px',
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
																		spacing:
																			{
																				blockGap:
																					'0px',
																			},
																	},
																	layout: {
																		type: 'default',
																	},
																},
																[
																	[
																		'surecart/cart-line-item-trial',
																		{
																			style: {
																				typography:
																					{
																						fontSize:
																							'14px',
																						textAlign:
																							'right',
																					},
																			},
																		},
																	],
																	[
																		'surecart/cart-line-item-fees',
																		{
																			style: {
																				typography:
																					{
																						fontSize:
																							'14px',
																						textAlign:
																							'right',
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
													layout: {
														type: 'flex',
														flexWrap: 'nowrap',
														justifyContent:
															'space-between',
														verticalAlignment:
															'center',
													},
												},
												[
													[
														'core/group',
														{
															style: {
																layout: {
																	selfStretch:
																		'fill',
																	flexSize:
																		null,
																},
															},
															layout: {
																type: 'default',
															},
														},
														[
															[
																'surecart/cart-line-item-quantity',
																{},
															],
														],
													],
													[
														'core/group',
														{
															style: {
																layout: {
																	selfStretch:
																		'fit',
																	flexSize:
																		null,
																},
																spacing: {
																	blockGap:
																		'0px',
																},
															},
															layout: {
																type: 'flex',
																orientation:
																	'vertical',
																justifyContent:
																	'right',
															},
														},
														[
															[
																'surecart/cart-line-item-remove',
																{
																	style: {
																		typography:
																			{
																				fontSize:
																					'14px',
																				fontStyle:
																					'normal',
																				fontWeight:
																					'400',
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
						],
					],
				],
			],
			[
				'core/group',
				{
					style: {
						spacing: {
							padding: {
								top: '0em',
								bottom: '0em',
								left: '0em',
								right: '0em',
							},
						},
						border: { top: { color: '#b0b0b069', width: '1px' } },
					},
					layout: { type: 'default' },
				},
				[
					[
						'surecart/cart-order-bumps',
						{
							style: {
								spacing: {
									padding: {
										top: '1.5em',
										bottom: '1.5em',
										left: '2em',
										right: '2em',
									},
								},
								border: {
									right: {},
									bottom: {
										color: '#b0b0b069',
										width: '1px',
									},
									left: {},
								},
							},
						},
						[
							[
								'core/group',
								{
									style: {
										spacing: {
											margin: { bottom: '0.75em' },
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
											content: 'Suggested for you',
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
										},
									],
									[
										'surecart/cart-order-bump-pagination',
										{
											style: {
												spacing: { blockGap: '0.25em' },
											},
										},
										[
											[
												'surecart/cart-order-bump-pagination-previous',
												{},
											],
											[
												'surecart/cart-order-bump-pagination-next',
												{},
											],
										],
									],
								],
							],
							[
								'surecart/cart-order-bump-template',
								{
									style: {
										spacing: { blockGap: '0.75em' },
									},
									layout: { type: 'flex' },
								},
								[
									[
										'core/group',
										{
											style: {
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
															selfStretch:
																'fixed',
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
																	fontSize:
																		'15px',
																	fontStyle:
																		'normal',
																	fontWeight:
																		'600',
																	lineHeight:
																		'1.3',
																},
															},
														},
													],
													[
														'surecart/cart-order-bump-description',
														{
															style: {
																typography: {
																	fontSize:
																		'13px',
																	lineHeight:
																		'1.3',
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
																	blockGap:
																		'4px',
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
																'surecart/cart-order-bump-scratch-amount',
																{
																	style: {
																		typography:
																			{
																				fontSize:
																					'14px',
																			},
																	},
																},
															],
															[
																'surecart/cart-order-bump-amount',
																{
																	style: {
																		typography:
																			{
																				fontSize:
																					'14px',
																				fontWeight:
																					'500',
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
																topLeft:
																	'74.6%',
																topRight:
																	'74.6%',
																bottomLeft:
																	'74.6%',
																bottomRight:
																	'74.6%',
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
						],
					],
					[
						'core/group',
						{
							style: {
								spacing: {
									padding: {
										top: '2em',
										bottom: '2em',
										left: '2em',
										right: '2em',
									},
									margin: { top: '0', bottom: '0' },
								},
							},
							layout: { type: 'constrained' },
						},
						[
							[
								'surecart/slide-out-cart-items-subtotal',
								{
									layout: {
										type: 'flex',
										justifyContent: 'space-between',
										flexWrap: 'nowrap',
										verticalAlignment: 'top',
									},
								},
								[
									[
										'core/group',
										{
											style: {
												spacing: { blockGap: '0px' },
											},
											layout: { type: 'default' },
										},
										[
											[
												'core/paragraph',
												{
													content: 'Subtotal',
													style: {
														typography: {
															fontStyle: 'normal',
															fontWeight: '500',
															fontSize: '18px',
															lineHeight: '1.4',
														},
														spacing: {
															margin: {
																top: '0px',
																bottom: '0px',
															},
														},
													},
												},
											],
											[
												'core/paragraph',
												{
													content:
														'Taxes &amp; shipping calculated at checkout',
													style: {
														typography: {
															fontSize: '14px',
															lineHeight: '1.4',
														},
														color: {
															text: 'var(--sc-input-help-text-color)',
														},
														elements: {
															link: {
																color: {
																	text: 'var(--sc-input-help-text-color)',
																},
															},
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
												spacing: { blockGap: '4px' },
											},
											layout: {
												type: 'flex',
												flexWrap: 'nowrap',
												justifyContent: 'right',
											},
										},
										[
											[
												'surecart/cart-subtotal-scratch-amount',
												{
													style: {
														typography: {
															fontSize: '18px',
															lineHeight: '1.4',
														},
													},
												},
											],
											[
												'surecart/cart-subtotal-amount',
												{
													style: {
														typography: {
															fontSize: '18px',
															fontStyle: 'normal',
															fontWeight: '500',
															lineHeight: '1.4',
														},
													},
												},
											],
										],
									],
								],
							],
							[
								'surecart/slide-out-cart-items-submit',
								{ style: { border: { radius: '4px' } } },
							],
						],
					],
				],
			],
		],
	],
];
