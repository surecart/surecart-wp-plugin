/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
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
						{
							label: 'Filters',
						},
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

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
};
