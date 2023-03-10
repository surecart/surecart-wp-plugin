import { getSpacingPresetCssVar } from '../../util';

export default function save({ attributes }) {
	const { style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};

	return (
		<sc-product-item-button
			style={{
				'--sc-product-button-padding-top': getSpacingPresetCssVar(
					padding?.top
				),
				'--sc-product-button-padding-bottom': getSpacingPresetCssVar(
					padding?.bottom
				),
				'--sc-product-button-padding-left': getSpacingPresetCssVar(
					padding?.left
				),
				'--sc-product-button-padding-right': getSpacingPresetCssVar(
					padding?.right
				),
				'--sc-product-button-margin-top': getSpacingPresetCssVar(
					margin?.top
				),
				'--sc-product-button-margin-bottom': getSpacingPresetCssVar(
					margin?.bottom
				),
				'--sc-product-button-margin-left': getSpacingPresetCssVar(
					margin?.left
				),
				'--sc-product-button-margin-right': getSpacingPresetCssVar(
					margin?.right
				),
			}}
		></sc-product-item-button>
	);
}
