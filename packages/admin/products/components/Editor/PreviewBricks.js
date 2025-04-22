/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default function PreviewBricks() {
	return (
		<div>
			<div
				css={css`
					height: 100px;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: var(--sc-color-gray-100);
					text-decoration: none;
					position: relative;
					font-family: Sans-serif;

					.button.button-primary {
						background-color: #ffd64f;
						border: none;
						box-shadow: none;
						color: #000;
						font-weight: 700;
						line-height: 1;
						margin-left: 10px;
						padding: 10px;
						text-shadow: none;
						text-transform: uppercase;
						text-decoration: none;
						vertical-align: baseline;
					}
				`}
			>
				<button class="button button-primary">
					{__('Edit with Bricks', 'surecart')}
				</button>
			</div>
		</div>
	);
}
