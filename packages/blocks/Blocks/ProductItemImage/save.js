/**
 * WordPress dependencies
 */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { __experimentalUseBorderProps as useBorderProps } from '@wordpress/block-editor';
import { getSpacingPresetCssVar } from '../../util';

export default ({ attributes }) => {
	const { src, sizing, style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};

	const { style } = useBorderProps(attributes);

	return (
		<sc-product-item-image
			src={src}
			sizing={sizing}
			style={{
				'--sc-product-image-border-color': style?.borderColor,
				'--sc-product-image-border-radius': style?.borderRadius,
				'--sc-product-image-border-width': style?.borderWidth,
				'--sc-product-image-padding-top': getSpacingPresetCssVar(
					padding?.top
				),
				'--sc-product-image-padding-bottom': getSpacingPresetCssVar(
					padding?.bottom
				),
				'--sc-product-image-padding-left': getSpacingPresetCssVar(
					padding?.left
				),
				'--sc-product-image-padding-right': getSpacingPresetCssVar(
					padding?.right
				),
				'--sc-product-image-margin-top': getSpacingPresetCssVar(
					margin?.top
				),
				'--sc-product-image-margin-bottom': getSpacingPresetCssVar(
					margin?.bottom
				),
				'--sc-product-image-margin-left': getSpacingPresetCssVar(
					margin?.left
				),
				'--sc-product-image-margin-right': getSpacingPresetCssVar(
					margin?.right
				),
			}}
		></sc-product-item-image>
	);
};
