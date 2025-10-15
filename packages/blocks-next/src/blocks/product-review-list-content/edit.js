/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
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
					selfStretch: 'fit',
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
						spacing: { blockGap: '0px' },
					},
					layout: { type: 'grid', columnCount: 1 },
				},
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
