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

import { useSetting } from '@wordpress/block-editor';

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
			css: css`
				flex: 1 1 auto;
				overflow: auto;
				max-width: ${width};
				width: 100%;
				margin: auto;
				border: var(--sc-drawer-border);
				box-shadow: 0 1px 2px #0d131e1a;

				.block-list-appender {
					position: relative;
				}

				> .wp-block:not(:last-child) {
					margin: 0 !important;
				}
			`,
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
			allowedBlocks,
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
