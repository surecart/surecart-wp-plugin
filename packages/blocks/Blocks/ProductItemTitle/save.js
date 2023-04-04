import {
	getColorPresetCssVar,
	getFontSizePresetCssVar,
	getSpacingPresetCssVar,
} from '../../util';

export default function save({ attributes }) {
	const {
		title,
		align,
		fontSize,
		textColor,
		style: styleAttribute,
	} = attributes;
	const { padding } = styleAttribute?.spacing || {};
	const { fontSize: customFontSize } = styleAttribute?.typography || {};
	const { text: color } = styleAttribute?.color || {};

	return (
		<sc-product-item-title
			style={{
				'--sc-product-title-padding-top': getSpacingPresetCssVar(
					padding?.top
				),
				'--sc-product-title-padding-bottom': getSpacingPresetCssVar(
					padding?.bottom
				),
				'--sc-product-title-padding-left': getSpacingPresetCssVar(
					padding?.left
				),
				'--sc-product-title-padding-right': getSpacingPresetCssVar(
					padding?.right
				),
				'--sc-product-title-font-size': fontSize
					? getFontSizePresetCssVar(fontSize)
					: customFontSize,
				'--sc-product-title-text-color': textColor
					? getColorPresetCssVar(textColor)
					: color,
				'--sc-product-title-align': align,
			}}
		>
			{title}
		</sc-product-item-title>
	);
}
