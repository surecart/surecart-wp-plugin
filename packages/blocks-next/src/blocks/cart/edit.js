/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	__experimentalUnitControl as UnitControl,
	useSetting,
} from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { TEMPLATE } from './template';

export default ({ attributes: { width }, setAttributes }) => {
	// const allowedBlocks = [
	// 	'surecart/cart-header-v2',
	// 	'surecart/cart-items-v2',
	// 	'surecart/cart-coupon-v2',
	// 	'surecart/cart-subtotal-v2',
	// 	'surecart/cart-submit-v2',
	// 	'surecart/cart-message-v2',
	// 	'surecart/cart-bump-line-item-v2',
	// ];

	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
		},
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'sc-cart__editor-container',
			style: {
				maxWidth: width,
			},
			template: TEMPLATE,
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<UnitControl
						label={__('Width', 'surecart')}
						labelPosition="top"
						__unstableInputWidth="80px"
						value={width}
						onChange={(width) => setAttributes({ width })}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div {...innerBlocksProps}></div>
			</div>
		</>
	);
};
