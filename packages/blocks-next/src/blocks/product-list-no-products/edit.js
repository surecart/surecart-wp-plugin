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
				'Add text or blocks that will display when a query returns no products.',
				'surecart'
			),
			align: 'center',
			content: __('No products found.', 'surecart'),
		},
	],
];

export default function QueryNoResultsEdit() {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
}
