/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import { __ } from '@wordpress/i18n';

const loading = keyframes`
  from {
    transform: translatex(-100%);
  }

  to {
	transform: translatex(220%);
  }
`;

export default () => {
	return (
		<div
			css={css`
				margin: auto;
			`}
		>
			<div
				css={css`
					width: 98px;
					height: 8px;
					position: relative;
					border-radius: 8px;
					background-color: var(--sc-color-neutral-300);
					margin: auto;
					overflow: hidden;
				`}
			>
				<div
					css={css`
						left: 0;
						width: 50%;
						height: 8px;
						position: absolute;
						border-radius: 8px;
						background-color: var(--sc-color-brand-primary);
						animation: ${loading} 1.5s ease infinite;
					`}
				></div>
			</div>
			<h2
				css={css`
					font-size: 28px;
					margin: 44px 0 0;
					text-align: center;
					line-height: 1.2;
					@media (max-width: 781px) {
						font-size: 22px;
					}
				`}
			>
				{__('Setting up your store...', 'surecart')}
			</h2>
		</div>
	);
};
