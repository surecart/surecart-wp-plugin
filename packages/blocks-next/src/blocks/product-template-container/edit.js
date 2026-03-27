import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	[
		'surecart/product-template',
		{
			style: {
				spacing: { blockGap: '30px' },
				layout: {
					selfStretch: 'fit',
					flexSize: null,
				},
			},
			layout: { type: 'grid', columnCount: 4 },
		},
	],
];

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
};
