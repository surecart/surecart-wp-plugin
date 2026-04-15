/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';

/**
 * Per-client config file location guidance.
 */
const CONFIG_LOCATIONS = {
	cursor: {
		instructions: () => (
			<ol>
				<li>
					{__(
						'Locate and open your Cursor MCP config file:',
						'surecart'
					)}
					<div>
						<div>
							<strong>{__('macOS / Linux:', 'surecart')}</strong>{' '}
							<code>~/.cursor/mcp.json</code>
						</div>
						<div
							css={css`
								margin-top: 4px;
							`}
						>
							<strong>{__('Windows:', 'surecart')}</strong>{' '}
							<code>
								{'C:\\Users\\YourUsername\\.cursor\\mcp.json'}
							</code>
						</div>
					</div>
				</li>
				<li>
					{__(
						'Paste the JSON config below into the file and save it.',
						'surecart'
					)}
				</li>
			</ol>
		),
	},
	vscode: {
		instructions: () => (
			<ol>
				<li>
					{__('Choose where to add the config:', 'surecart')}
					<div>
						<div>
							<strong>{__('Per project:', 'surecart')}</strong>{' '}
							<code>.vscode/mcp.json</code>{' '}
							{__('in your project root', 'surecart')}
						</div>
						<div
							css={css`
								margin-top: var(--sc-spacing-small);
							`}
						>
							<strong>
								{__('Global (all projects):', 'surecart')}
							</strong>{' '}
							{__('Open VS Code Settings', 'surecart')} (
							<code>Cmd+,</code> / <code>Ctrl+,</code>)
							{' \u2192 '}
							{__('search', 'surecart')} <code>mcp.servers</code>
						</div>
					</div>
				</li>
				<li>
					{__(
						'Paste the JSON config below into the file and save it.',
						'surecart'
					)}
				</li>
			</ol>
		),
	},
	continue: {
		instructions: () => (
			<ol>
				<li>
					{__(
						'Locate and open your Continue config file:',
						'surecart'
					)}
					<div>
						<div>
							<strong>{__('macOS / Linux:', 'surecart')}</strong>{' '}
							<code>~/.continue/config.json</code>{' '}
							{__('or', 'surecart')}{' '}
							<code>~/.continue/config.yaml</code>
						</div>
						<div
							css={css`
								margin-top: 4px;
							`}
						>
							<strong>{__('Windows:', 'surecart')}</strong>{' '}
							<code>
								{
									'C:\\Users\\YourUsername\\.continue\\config.json'
								}
							</code>
						</div>
					</div>
				</li>
				<li>
					{__(
						'Paste the JSON config below into the file and save it.',
						'surecart'
					)}
				</li>
			</ol>
		),
	},
	other: {
		instructions: () => (
			<ol>
				<li>
					{__(
						"Refer to your AI client's documentation for the MCP configuration file location.",
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
		),
	},
};

/**
 * Generic client steps for Cursor, VS Code, Continue, and Other (Steps 2-4).
 */
const GenericClientSteps = ({ selectedClient, configJson, copied, onCopy }) => {
	const location = CONFIG_LOCATIONS[selectedClient];
	const LocationInstructions = location?.instructions;

	return (
		<>
			{/* Step 2 — Copy JSON config */}
			<li>
				<strong>
					{__(
						'Copy the JSON config into your config file',
						'surecart'
					)}
				</strong>
				{LocationInstructions && <LocationInstructions />}
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
						{' \u2014 '}
						{__('your WordPress username (prefilled).', 'surecart')}
					</li>
					<li>
						<strong>WP_API_PASSWORD</strong>
						{' \u2014 '}
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
					<li>
						{__('The version must be 20.1 or higher.', 'surecart')}
					</li>
					<li>
						{__('If it is lower, run:', 'surecart')}{' '}
						<code>nvm install 20 && nvm use 20</code>
					</li>
				</ol>
			</li>
		</>
	);
};

export default GenericClientSteps;
