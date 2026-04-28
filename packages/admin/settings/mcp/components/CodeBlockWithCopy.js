/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';

export default function ({ content, copied, onCopy }) {
	return (
		<div
			css={css`
				position: relative;
				margin-top: var(--sc-spacing-small);
			`}
		>
			<pre
				css={css`
					padding: 1em;
					padding-right: 5em;
					background-color: var(--sc-color-gray-900);
					color: var(--sc-color-gray-100);
					margin: 0;
					overflow: auto;
					border-radius: var(--sc-border-radius-medium);
				`}
			>
				{content}
			</pre>
			<div
				css={css`
					position: absolute;
					top: var(--sc-spacing-small);
					right: var(--sc-spacing-small);
				`}
			>
				<ScButton size="small" onClick={onCopy}>
					<ScIcon name={copied ? 'check' : 'copy'} slot="prefix" />
					{copied
						? __('Copied!', 'surecart')
						: __('Copy', 'surecart')}
				</ScButton>
			</div>
		</div>
	);
}
