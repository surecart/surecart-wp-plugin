/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default function PreviewElementor() {
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
				`}
			>
				<button
					id="elementor-editor-button"
					class="button button-primary button-hero"
				>
					<i class="eicon-elementor-square" aria-hidden="true"></i>
					{__('Edit with Elementor', 'surecart')}
				</button>
			</div>
		</div>
	);
}
