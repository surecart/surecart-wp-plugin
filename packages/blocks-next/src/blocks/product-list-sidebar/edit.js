import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	[
		'surecart/product-list-filter-checkboxes',
		{
			style: {
				spacing: {
					blockGap: '0',
					margin: { top: '0', bottom: 'var:preset|spacing|10' },
				},
			},
		},
	],
];

export default ({ attributes: { label } }) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
};
