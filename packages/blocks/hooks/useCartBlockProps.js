import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	if (!attributes) return {};
	const { border, textColor, backgroundColor, padding } = attributes;
	return useBlockProps({
		style: {
			...(border ? { borderBottom: ' var(--sc-drawer-border)' } : {}),
			...(backgroundColor ? { backgroundColor: backgroundColor } : {}),
			...(textColor ? { color: textColor } : {}),
			...(padding?.top ? { paddingTop: padding?.top } : {}),
			...(padding?.bottom ? { paddingBottom: padding?.bottom } : {}),
			...(padding?.left ? { paddingLeft: padding?.left } : {}),
			...(padding?.right ? { paddingRight: padding?.right } : {}),
		},
	});
};
