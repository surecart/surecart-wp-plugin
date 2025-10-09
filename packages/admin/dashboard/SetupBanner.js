/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';

export default () => {
	return (
		<div
			css={css`
				color: var(--sc-color-white);
				background-color: var(--sc-brand-color-background-inverse);
				padding: var(--sc-spacing-small);
				display: flex;
				gap: var(--sc-spacing-xx-large);
				justify-content: space-between;
				align-items: center;
				border-radius: var(--sc-border-radius-x-large);
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: var(--sc-spacing-x-small);
				`}
			>
				<ScIcon
					name="arrow-up-right"
					css={css`
						font-size: var(--sc-font-size-x-large);
						padding: var(--sc-spacing-x-small);
					`}
				/>
				{__('Complete your store setup to go live.', 'surecart')}
			</div>
			<ScButton
				type="default"
				css={css`
					--sc-button-default-color: var(
						--sc-brand-color-background-inverse
					);
					--sc-button-default-border-color: transparent;
				`}
				href="admin.php?page=sc-settings"
			>
				{__('Complete Setup', 'surecart')}
			</ScButton>
		</div>
	);
};
