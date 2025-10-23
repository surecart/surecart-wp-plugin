/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({
	title,
	buttonText,
	href = '#',
	target = '_self',
	description,
	icon,
	highlighted = false,
	onClick = undefined,
}) => {
	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: 10px;
				padding: var(--sc-card-padding, var(--sc-spacing-large));
				background: var(
					--sc-card-background-color,
					var(--sc-color-white)
				);
				border: 1px solid
					var(--sc-card-border-color, var(--sc-color-gray-300));
				border-radius: var(
					--sc-card-border-radius,
					var(--sc-input-border-radius-medium)
				);
				box-shadow: var(--sc-shadow-small);
			`}
		>
			<ScIcon
				name={icon}
				style={{
					'font-size': '24px',
					color: 'var(--sc-color-brand-secondary)',
					margin: 0,
					marginBottom: '6px',
				}}
			/>

			<h3
				css={css`
					margin: 0;
					font-size: 1em;
					line-height: 1.4;
				`}
			>
				{title}
			</h3>
			<p
				css={css`
					margin: 0;
					font-size: 0.95em;
					font-weight: 400;
					color: var(--sc-color-gray-600);
					line-height: 1.5;
					flex-grow: 1;
				`}
			>
				{description}
			</p>
			<div
				css={css`
					margin-top: 6px;
				`}
			>
				<ScButton
					type={highlighted ? 'primary' : 'default'}
					onClick={onClick}
					href={href}
					target={target}
					style={{
						'--primary-background':
							'var(--sc-brand-color-background-inverse)',
					}}
					css={css`
						width: 100%;

						@media (min-width: 640px) {
							width: auto;
						}
					`}
				>
					{buttonText}
				</ScButton>
			</div>
		</div>
	);
};
