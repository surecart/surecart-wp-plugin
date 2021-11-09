/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
	'checkout-engine/coupon',
	'checkout-engine/divider',
	'checkout-engine/line-items',
	'checkout-engine/total',
	'checkout-engine/subtotal',
];

export default ( { isSelected } ) => {
	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			renderAppender: isSelected
				? InnerBlocks.ButtonBlockAppender
				: false,
			template: [
				[ 'checkout-engine/divider', {} ],
				[ 'checkout-engine/line-items', {} ],
				[ 'checkout-engine/divider', {} ],
				[
					'checkout-engine/subtotal',
					{
						text: __( 'Subtotal', 'checkout_engine' ),
					},
				],
				[
					'checkout-engine/coupon',
					{
						text: __( 'Add Coupon Code', 'checkout_engine' ),
						button_text: __( 'Apply Coupon', 'checkout_engine' ),
					},
				],
				[ 'checkout-engine/divider', {} ],
				[
					'checkout-engine/total',
					{
						text: __( 'Total', 'checkout_engine' ),
						subscription_text: __(
							'Total Due Today',
							'checkout_engine'
						),
					},
				],
			],
			allowedBlocks: ALLOWED_BLOCKS,
		}
	);

	return <ce-order-summary { ...innerBlocksProps }></ce-order-summary>;
};
