import {
	getFontSizePresetCssVar,
	getSpacingPresetCssVar,
	getColorPresetCssVar,
} from '../../util';
import { priceList } from './edit';

export default function save({ attributes }) {
	const {
		align,
		fontSize,
		fontWeight,
		textColor,
		style: styleAttribute,
	} = attributes;
	const { padding } = styleAttribute?.spacing || {};
	const { fontSize: customFontSize } = styleAttribute?.typography || {};
	const { text: color } = styleAttribute?.color || {};

	return (
		<sc-product-item-price
			prices={priceList}
			style={{
				'--sc-product-price-padding-top': getSpacingPresetCssVar(
					padding?.top
				),
				'--sc-product-price-padding-bottom': getSpacingPresetCssVar(
					padding?.bottom
				),
				'--sc-product-price-padding-left': getSpacingPresetCssVar(
					padding?.left
				),
				'--sc-product-price-padding-right': getSpacingPresetCssVar(
					padding?.right
				),
				'--sc-product-price-font-size': fontSize
					? getFontSizePresetCssVar(fontSize)
					: customFontSize,
				'--sc-product-price-text-color': textColor
					? getColorPresetCssVar(textColor)
					: color,
				'--sc-product-price-align': align,
				'--sc-product-price-font-weight': fontWeight,
			}}
		></sc-product-item-price>
	);
}
