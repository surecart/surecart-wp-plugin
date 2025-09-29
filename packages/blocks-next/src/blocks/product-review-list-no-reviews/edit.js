/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	[
		'core/paragraph',
		{
			placeholder: __(
				'Add text or blocks that will display when a query returns no reviews.',
				'surecart'
			),
			align: 'left',
			content: __('No reviews found.', 'surecart'),
		},
	],
	[
		'core/buttons',
		[
			[
				'core/button',
				{
					text: __('Write a review', 'surecart'),
					className: 'is-style-surecart-primary',
				},
			],
		],
	],
];

export default function QueryNoResultsEdit() {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
}
