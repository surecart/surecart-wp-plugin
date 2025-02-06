/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [
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
									color: '#dce0e6',
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

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames,
	clientId,
}) => {
	const { removable, editable, divider_enabled } = attributes;

	const placeholderImageUrl =
		scBlockData?.plugin_url + '/images/placeholder-thumbnail.jpg';

	const lineItems = [
		{
			id: 1,
			quantity: 2,
			removable,
			editable,
			price: {
				name: 'Basic',
				product: {
					name: 'Example Product',
					image_url: placeholderImageUrl,
				},
				display_amount: scData?.currency_symbol + '12.34',
			},
		},
		{
			id: 2,
			quantity: 4,
			removable,
			editable,
			price: {
				name: 'Monthly',
				product: {
					name: 'Example Product',
					image_url: placeholderImageUrl,
				},
				display_amount: scData?.currency_symbol + '123.45',
			},
		},
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Removable', 'surecart')}
							help={__(
								'Allow line items to be removed.',
								'surecart'
							)}
							checked={removable}
							onChange={(removable) =>
								setAttributes({ removable })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Editable', 'surecart')}
							help={__(
								'Allow line item quantities to be editable.',
								'surecart'
							)}
							checked={editable}
							onChange={(editable) => setAttributes({ editable })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show divider', 'surecart')}
							help={__(
								'Show a divider between line items.',
								'surecart'
							)}
							checked={divider_enabled}
							onChange={(divider_enabled) =>
								setAttributes({ divider_enabled })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={lineItems}
				clientId={clientId}
				className={__unstableLayoutClassNames}
				after={
					divider_enabled && <hr className="sc-cart-items-divider" />
				}
			/>
		</>
	);
};
