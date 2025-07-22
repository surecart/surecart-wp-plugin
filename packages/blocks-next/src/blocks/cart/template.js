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
						color: { text: '#828c99' },
						elements: { link: { color: { text: '#828c99' } } },
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
						color: { text: '#4b5563' },
						elements: { link: { color: { text: '#4b5563' } } },
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
						color: { background: '#f3f4f6' },
						border: { radius: '4px' },
					},
				},
			],
		],
	],
	[
		'surecart/slide-out-cart-line-items',
		{
			border: false,
			padding: { top: '0em', right: '0em', bottom: '0em', left: '0em' },
			metadata: {
				ignoredHookedBlocks: ['surecart/cart-line-item-divider'],
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
									aspectRatio: '1',
									width: '',
									height: '',
									style: {
										layout: {
											selfStretch: 'fixed',
											flexSize: '80px',
										},
										border: {
											color: '#dce0e6',
											width: '1px',
											radius: '4px',
										},
										color: { duotone: 'unset' },
										spacing: {
											margin: { top: '0', bottom: '0' },
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
															blockGap: '0px',
														},
													},
													layout: { type: 'default' },
												},
												[
													[
														'surecart/cart-line-item-title',
														{
															style: {
																typography: {
																	fontStyle:
																		'normal',
																	fontWeight:
																		'500',
																	lineHeight:
																		'1.4',
																	textDecoration:
																		'none',
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
														},
													],
													[
														'core/group',
														{
															style: {
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
																'surecart/cart-line-item-price-name',
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
																'surecart/cart-line-item-variant',
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
														],
													],
													[
														'surecart/cart-line-item-status',
														{
															style: {
																typography: {
																	textAlign:
																		'right',
																},
																elements: {
																	link: {
																		color: {
																			text: 'var:preset|color|vivid-red',
																		},
																	},
																},
															},
															textColor:
																'vivid-red',
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
															blockGap: '0px',
														},
													},
													layout: { type: 'default' },
												},
												[
													[
														'core/group',
														{
															style: {
																spacing: {
																	blockGap:
																		'4px',
																},
																typography: {
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
																	},
																},
															],
															[
																'surecart/cart-line-item-amount',
																{
																	style: {
																		color: {
																			text: '#4b5563',
																		},
																		elements:
																			{
																				link: {
																					color: {
																						text: '#4b5563',
																					},
																				},
																			},
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
															selfStretch: 'fit',
															flexSize: null,
														},
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
														'surecart/cart-line-item-remove',
														{
															style: {
																typography: {
																	fontSize:
																		'14px',
																	fontStyle:
																		'normal',
																	fontWeight:
																		'400',
																},
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
						top: '2em',
						bottom: '2em',
						left: '2em',
						right: '2em',
					},
				},
				border: { top: { color: '#e5e7eb', width: '1px' } },
			},
			layout: { type: 'default' },
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
							style: { spacing: { blockGap: '0px' } },
							layout: { type: 'default' },
						},
						[
							[
								'core/paragraph',
								{
									content: 'Subtotal',
									style: {
										color: { text: '#4b5563' },
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
										color: { text: '#828c99' },
										elements: {
											link: {
												color: { text: '#828c99' },
											},
										},
									},
								},
							],
						],
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
								color: { text: '#4b5563' },
								elements: {
									link: { color: { text: '#4b5563' } },
								},
							},
						},
					],
				],
			],
			[
				'surecart/slide-out-cart-items-submit',
				{ style: { border: { radius: '4px' } } },
			],
		],
	],
];
