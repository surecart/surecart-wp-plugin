import { css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ slot, border, props = {} }) => {
	const getPaddingCSS = () => {
		if (border) {
			return '';
		}
		return slot === 'footer' ? 'padding-top: 0;' : 'padding-bottom: 0;';
	};

	const getBorderCSS = () => {
		if (!border) {
			return;
		}
		return slot === 'footer'
			? 'border-top: var(--sc-drawer-border);'
			: 'border-bottom: var(--sc-drawer-border);';
	};

	return useBlockProps({
		css: css`
			padding: var(--sc-drawer-${slot}-spacing);
			${getPaddingCSS()}
			${getBorderCSS()}
		`,
		...props,
	});
};
