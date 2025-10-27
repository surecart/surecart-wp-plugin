/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

const QuickLink = ({ icon, text, href, target = '_self' }) => {
	return (
		<a
			href={href}
			target={target}
			css={css`
				text-decoration: none;
				color: inherit;
				display: block;
				flex: 1;
				min-width: 0;
				border: var(--sc-card-border);
				background: var(--sc-color-white);
				border-radius: var(--sc-border-radius-medium);
				box-shadow: var(--sc-input-box-shadow);
				padding: var(--sc-spacing-x-small) var(--sc-spacing-small);
				line-height: 1;
				transition: var(--sc-transition-medium);
				&:hover {
					background: var(--sc-color-gray-50);
				}
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
					name={icon}
					aria-hidden="true"
					style={{
						'font-size': '18px',
						color: 'var(--sc-color-gray-700)',
						margin: 0,
						flexShrink: 0,
					}}
				/>
				<span
					css={css`
						font-size: var(--sc-font-size-small);
						font-weight: var(--sc-font-weight-medium);
						color: var(--sc-color-gray-900);
					`}
					// translators: %s is the text of the link
					aria-label={__(`${text} (opens in new window)`, 'surecart')}
				>
					{text}
				</span>
			</div>
		</a>
	);
};

export default QuickLink;
