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
	// 	'surecart/slide-out-cart-header',
	// 	'surecart/slide-out-cart-items',
	// 	'surecart/slide-out-cart-coupon',
	// 	'surecart/slide-out-cart-subtotal',
	// 	'surecart/slide-out-cart-submit',
	// 	'surecart/slide-out-cart-message',
	// 	'surecart/slide-out-cart-bump-line-item',
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
