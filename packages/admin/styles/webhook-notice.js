import { css } from '@emotion/core';

export const styles = {
	'--sc-color-primary-500': 'var(--wp-admin-theme-color)',
	'--sc-focus-ring-color-primary': 'var(--wp-admin-theme-color)',
	'--sc-input-border-color-focus': 'var(--wp-admin-theme-color)',
	'--sc-color-primary-text': '#fff',
};

export const admin = css`
	:root {
		${styles}
        backround: red;
	}

	.surecart-webhook-change-notice {
		margin-top: 1rem;
		background: red;
	}
`;

export default admin;

