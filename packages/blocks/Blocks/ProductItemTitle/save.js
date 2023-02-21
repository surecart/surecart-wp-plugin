import { getSpacingPresetCssVar } from '../../util';

export default function save({ attributes }) {
	const { title, fontSize, style: styleAttribute } = attributes;
	const { padding } = styleAttribute?.spacing || {};

	return (
		<sc-product-item-title
			style={{
				'--sc-product-title-padding-top': getSpacingPresetCssVar(
					padding?.top
				),
				'--sc-product-title-padding-bottom':
					getSpacingPresetCssVar(padding?.bottom) ?? '1rem',
				'--sc-product-title-padding-left': getSpacingPresetCssVar(
					padding?.left
				),
				'--sc-product-title-padding-right': getSpacingPresetCssVar(
					padding?.right
				),
				'--sc-product-title-font-size': `${fontSize ?? 18}px`,
			}}
		>
			{title}
		</sc-product-item-title>
	);
}
