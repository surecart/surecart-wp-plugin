/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	__experimentalUnitControl as UnitControl,
	__experimentalUseInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';

import {
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
} from '@wordpress/components';

const allowedBlocks = [
	'surecart/cart-coupon',
	'surecart/cart-submit',
	'surecart/cart-subtotal',
	'surecart/cart-bump-line-item',
	'surecart/cart-items',
	'surecart/cart-header',
	'surecart/cart-message',
];

import { useSettings } from '@wordpress/block-editor';

export default ({ attributes: { width }, setAttributes }) => {
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
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
			allowedBlocks,
		}
	);

	const units = useCustomUnits({
		availableUnits: useSettings('spacing.units') || [
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
