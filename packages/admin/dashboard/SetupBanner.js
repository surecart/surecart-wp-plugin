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
				flex-direction: column;
				gap: var(--sc-spacing-medium);
				align-items: flex-start;
				border-radius: var(--sc-border-radius-x-large);

				@media (min-width: 640px) {
					flex-direction: row;
					gap: var(--sc-spacing-xx-large);
					justify-content: space-between;
					align-items: center;
				}
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: var(--sc-spacing-x-small);
					font-size: 14px;

					@media (min-width: 640px) {
						font-size: inherit;
					}
				`}
			>
				<ScIcon
					name="arrow-up-right"
					css={css`
						font-size: var(--sc-font-size-large);
						padding: var(--sc-spacing-x-small);
						flex-shrink: 0;

						@media (min-width: 640px) {
							font-size: var(--sc-font-size-x-large);
						}
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
					width: 100%;

					@media (min-width: 640px) {
						width: auto;
					}
				`}
				href="admin.php?page=sc-settings"
			>
				{__('Complete Setup', 'surecart')}
			</ScButton>
		</div>
	);
};
