/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

const ALLOWED_BLOCKS = [
	'checkout-engine/coupon',
	'checkout-engine/divider',
	'checkout-engine/line-items',
	'checkout-engine/total',
	'checkout-engine/subtotal',
];

export default ( { isSelected, attributes, setAttributes } ) => {
	const { collapsible, collapsed } = attributes;

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

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Collapsible', 'checkout-engine' ) }
							checked={ collapsible }
							onChange={ ( collapsible ) => {
								setAttributes( { collapsible } );
								if ( ! collapsible ) {
									setAttributes( { collapsed: false } );
								}
							} }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __(
								'Collapsed By Default',
								'checkout-engine'
							) }
							checked={ collapsed }
							onChange={ ( collapsed ) => {
								setAttributes( { collapsed } );
								if ( collapsed ) {
									setAttributes( { collapsible: true } );
								}
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ce-order-summary
				collapsible={ collapsible }
				collapsed={ collapsed }
				{ ...innerBlocksProps }
			></ce-order-summary>
		</Fragment>
	);
};
