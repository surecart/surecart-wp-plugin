/**
 * WordPress dependencies
 */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { getSpacingPresetCssVar } from '../../util';

export const PRODUCT_ITEM_LAYOUT = [
	[
		'surecart/product-item-title',
		{
			title: 'Product Title',
			fontSize: 16,
		},
	],
	['surecart/product-item-price'],
	[
		'surecart/product-item-image',
		{
			src: 'https://images.unsplash.com/photo-1617360547704-3da8b5363369?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2NzU3OTY4NjM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=360',
			sizing: 'cover',
			style: {
				border: {
					width: '1px',
					radius: '4px',
				},
				spacing: {
					margin: {
						top: '0.44rem',
						bottom: '0.44rem',
					},
				},
			},
		},
	],
	['surecart/product-item-button'],
];

const ALLOWED_BLOCKS = [
	'surecart/product-item-title',
	'surecart/product-item-image',
	'surecart/product-item-price',
	'surecart/product-item-button',
];

export default ({ attributes }) => {
	const { style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};
	const blockProps = useBlockProps();
	const defaultPadding = '0.88rem';

	return (
		<div
			{...blockProps}
			style={{
				borderColor: '#cecece',
				borderRadius: styleAttribute?.border?.radius,
				borderWidth: styleAttribute?.border?.width,
				paddingTop:
					getSpacingPresetCssVar(padding?.top) ?? defaultPadding,
				paddingBottom:
					getSpacingPresetCssVar(padding?.bottom) ?? defaultPadding,
				paddingLeft:
					getSpacingPresetCssVar(padding?.left) ?? defaultPadding,
				paddingRight:
					getSpacingPresetCssVar(padding?.right) ?? defaultPadding,
				marginTop: getSpacingPresetCssVar(margin?.top),
				marginBottom: getSpacingPresetCssVar(margin?.bottom),
				marginLeft: getSpacingPresetCssVar(margin?.left),
				marginRight: getSpacingPresetCssVar(margin?.right),
			}}
		>
			<InnerBlocks
				templateLock={'insert'}
				template={PRODUCT_ITEM_LAYOUT}
				allowedBlocks={ALLOWED_BLOCKS}
				renderAppender={false}
			/>
		</div>
	);
};
