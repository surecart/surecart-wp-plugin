/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

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
				`}
			>
				<div
					css={css`
						left: 0;
						width: 30%;
						height: 8px;
						position: absolute;
						border-radius: 8px;
						background-color: var(--sc-color-brand-primary);
					`}
				></div>
			</div>
			<h2
				css={css`
					font-size: 28px;
					margin: 44px 0 0;
				`}
			>
				{__('Setting up your store...', 'surecart')}
			</h2>
		</div>
	);
};
