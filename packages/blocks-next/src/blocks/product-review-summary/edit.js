/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps({
		className: 'sc-lightbox-overlay',
	});

	const TEMPLATE = [
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
							},
							layout: {
								selfStretch: 'fill',
								flexSize: null,
							},
						},
						layout: {
							type: 'flex',
							selfStretch: 'fill',
							flexWrap: 'nowrap',
							orientation: 'vertical',
						},
					},
					[
						[
							'surecart/product-review-average-rating-value',
							{
								className: 'is-style-slash',
								style: {
									typography: {
										fontStyle: 'normal',
										fontWeight: '600',
									},
								},
								fontSize: 'large',
							},
						],
						['surecart/product-review-average-rating-stars'],
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
											blockGap: 'var:preset|spacing|20',
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
					columns: 1,
					row_gap: 2,
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
	];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
}
