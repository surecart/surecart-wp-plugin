/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';

/**
 * Claude Desktop-specific setup steps.
 */
const ClaudeDesktopSteps = ({ configJson, copied, onCopy }) => (
	<>
		{/* Step 2 — Add config to Claude Desktop */}
		<li>
			<strong>
				{__('Add the config to Claude Desktop', 'surecart')}
			</strong>
			<ol>
				<li>
					{__('Open', 'surecart')}{' '}
					<strong>{__('Claude Desktop', 'surecart')}</strong>.
				</li>
				<li>
					{__(
						'Click the dropdown next to your name (bottom-left)',
						'surecart'
					)}{' '}
					{'>'} <strong>{__('Settings', 'surecart')}</strong>.
				</li>
				<li>
					{__('In the left sidebar, click', 'surecart')}{' '}
					<strong>{__('Developer', 'surecart')}</strong>.
				</li>
				<li>
					{__('Under "Local MCP Servers", click', 'surecart')}{' '}
					<strong>{__('Edit Config', 'surecart')}</strong>.
				</li>
				<li>
					{__(
						'Open the file in your preferred text editor (e.g. TextEdit, Notepad, VS Code).',
						'surecart'
					)}
				</li>
				<li>
					{__(
						'Paste the JSON config below into the file and save it.',
						'surecart'
					)}
				</li>
			</ol>
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
					{configJson}
				</pre>
				<div
					css={css`
						position: absolute;
						top: var(--sc-spacing-small);
						right: var(--sc-spacing-small);
					`}
				>
					<ScButton size="small" onClick={onCopy}>
						<ScIcon
							name={copied ? 'check' : 'copy'}
							slot="prefix"
						/>
						{copied
							? __('Copied!', 'surecart')
							: __('Copy', 'surecart')}
					</ScButton>
				</div>
			</div>
		</li>

		{/* Step 3 — Update environment variables */}
		<li>
			<strong>
				{__('Update the environment variables', 'surecart')}
			</strong>
			<ol>
				<li>
					<strong>WP_API_USERNAME</strong>
					{' — '}
					{__('your WordPress username (prefilled).', 'surecart')}
				</li>
				<li>
					<strong>WP_API_PASSWORD</strong>
					{' — '}
					{__(
						'replace "your-application-password" with the password from Step 1.',
						'surecart'
					)}
				</li>
			</ol>
		</li>

		{/* Step 4 — Verify Node.js version */}
		<li>
			<strong>{__('Verify Node.js version', 'surecart')}</strong>
			<ol>
				<li>
					{__('In your terminal, run:', 'surecart')}{' '}
					<code>node -v</code>
				</li>
				<li>{__('The version must be 20.1 or higher.', 'surecart')}</li>
				<li>
					{__('If it is lower, run:', 'surecart')}{' '}
					<code>nvm install 20 && nvm use 20</code>
				</li>
			</ol>
		</li>
	</>
);

export default ClaudeDesktopSteps;
