export default ({ attributes }) => {
	if (!attributes) return {};
	const { border, textColor, backgroundColor, padding } = attributes;
	return {
		...(border ? { borderBottom: 'var(--sc-drawer-border)' } : {}),
		...(backgroundColor ? { backgroundColor: backgroundColor } : {}),
		...(textColor
			? { color: textColor, '--sc-input-label-color': textColor }
			: {}),
		...(padding?.top ? { paddingTop: padding?.top } : {}),
		...(padding?.bottom ? { paddingBottom: padding?.bottom } : {}),
		...(padding?.left ? { paddingLeft: padding?.left } : {}),
		...(padding?.right ? { paddingRight: padding?.right } : {}),
	};
};
