/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [
			['core/paragraph', { content: __('Subtotal', 'surecart') }],
			[
				'core/group',
				{
					style: { spacing: { blockGap: '4px' } },
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'right',
					},
				},
				[
					['surecart/cart-subtotal-scratch-amount', {}],
					['surecart/cart-subtotal-amount'],
				],
			],
		],
	});

	return <div {...innerBlocksProps}></div>;
};
