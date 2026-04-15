/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import CodeBlockWithCopy from './CodeBlockWithCopy';
import EnvVarsStep from './EnvVarsStep';
import NodeVersionStep from './NodeVersionStep';

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
export default function ({ selectedClient, configJson, copied, onCopy }) {
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
				<CodeBlockWithCopy
					content={configJson}
					copied={copied}
					onCopy={onCopy}
				/>
			</li>

			<EnvVarsStep />
			<NodeVersionStep />
		</>
	);
}
