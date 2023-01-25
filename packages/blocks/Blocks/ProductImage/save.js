import { getSpacingPresetCssVar } from '../../util';

export default function save({ attributes }) {
	const { src, sizing, alt, style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};

	return (
		<sc-product-image
			src={src}
			sizing={sizing}
			alt={alt}
			style={{
				'--sc-product-image-border-color': ' ',
				'--sc-product-image-border-radius': ' ',
				'--sc-product-image-border-width': ' ',
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
		></sc-product-image>
	);
}
