import { css } from '@emotion/core';

export const styles = {
	'--sc-color-primary-500': 'var(--wp-admin-theme-color)',
	'--sc-focus-ring-color-primary': 'var(--wp-admin-theme-color)',
	'--sc-input-border-color-focus': 'var(--wp-admin-theme-color)',
};

export const admin = css`
	:root {
		${styles}
	}
`;

export default admin;
