/**
 * WordPress dependencies
 */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { getSpacingPresetCssVar } from '../../util';

const PRODUCT_ITEM_BLOCKS = [
	[
		'surecart/product-list-title',
		{
			title: 'Product Title',
		},
	],
	[
		'surecart/product-list-image',
		{
			src: 'https://images.unsplash.com/photo-1617360547704-3da8b5363369?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2NzU3OTY4NjM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=360',
			sizing: 'cover',
		},
	],
];

const ALLOWED_BLOCKS = [
	'surecart/product-list-title',
	'surecart/product-list-image',
];

export default ({ attributes }) => {
	const { style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};

	const blockProps = useBlockProps();
	const { style } = useBorderProps(attributes);

	return (
		<div
			{...blockProps}
			style={{
				borderColor: style?.borderColor,
				borderRadius: style?.borderRadius,
				borderWidth: style?.borderWidth,
				paddingTop: getSpacingPresetCssVar(padding?.top),
				paddingBottom: getSpacingPresetCssVar(padding?.bottom),
				paddingLeft: getSpacingPresetCssVar(padding?.left),
				paddingRight: getSpacingPresetCssVar(padding?.right),
				marginTop: getSpacingPresetCssVar(margin?.top),
				marginBottom: getSpacingPresetCssVar(margin?.bottom),
				marginLeft: getSpacingPresetCssVar(margin?.left),
				marginRight: getSpacingPresetCssVar(margin?.right),
			}}
		>
			<InnerBlocks
				templateLock={'insert'}
				template={PRODUCT_ITEM_BLOCKS}
				allowedBlocks={ALLOWED_BLOCKS}
				renderAppender={false}
			/>
		</div>
	);
};
