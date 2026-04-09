/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScIcon,
	ScSelect,
	ScAlert,
	ScText,
} from '@surecart/components-react';
import SettingsBox from '../../SettingsBox';

/**
 * Build the MCP args array. When the site is served over plain HTTP
 * (e.g. local development), the `--allow-http` flag is required.
 *
 * @param {string} mcpUrl The REST URL for the MCP endpoint.
 * @return {string[]} The args for the npx command.
 */
const getMcpArgs = (mcpUrl) => {
	const args = ['-y', '@automattic/mcp-wordpress-remote@latest'];
	if (mcpUrl && mcpUrl.startsWith('http://')) {
		args.push('--allow-http');
	}
	return args;
};

const AI_CLIENTS = {
	claude_desktop: {
		label: __('Claude Desktop', 'surecart'),
		configPath:
			'~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\claude_desktop_config.json (Windows)',
		getConfig: (mcpUrl, username) => ({
			mcpServers: {
				surecart: {
					command: 'npx',
					args: getMcpArgs(mcpUrl),
					env: {
						WP_API_URL: mcpUrl,
						WP_API_USERNAME: username,
						WP_API_PASSWORD: 'your-application-password',
					},
				},
			},
		}),
	},
	claude_code: {
		label: __('Claude Code', 'surecart'),
		configPath: '.mcp.json (project) or ~/.claude.json (global)',
		cliCommand: (mcpUrl) => {
			const allowHttp =
				mcpUrl && mcpUrl.startsWith('http://') ? ' --allow-http' : '';
			return `claude mcp add surecart -- npx -y @automattic/mcp-wordpress-remote@latest${allowHttp}`;
		},
		getConfig: (mcpUrl, username) => ({
			mcpServers: {
				surecart: {
					command: 'npx',
					args: getMcpArgs(mcpUrl),
					env: {
						WP_API_URL: mcpUrl,
						WP_API_USERNAME: username,
						WP_API_PASSWORD: 'your-application-password',
					},
				},
			},
		}),
	},
	cursor: {
		label: __('Cursor', 'surecart'),
		configPath: '~/.cursor/mcp.json',
		getConfig: (mcpUrl, username) => ({
			mcpServers: {
				surecart: {
					command: 'npx',
					args: getMcpArgs(mcpUrl),
					env: {
						WP_API_URL: mcpUrl,
						WP_API_USERNAME: username,
						WP_API_PASSWORD: 'your-application-password',
					},
				},
			},
		}),
	},
	vscode: {
		label: __('VS Code (Copilot)', 'surecart'),
		configPath:
			'.vscode/mcp.json (project) or settings.json > mcp.servers (global)',
		getConfig: (mcpUrl, username) => ({
			servers: {
				surecart: {
					command: 'npx',
					args: getMcpArgs(mcpUrl),
					env: {
						WP_API_URL: mcpUrl,
						WP_API_USERNAME: username,
						WP_API_PASSWORD: 'your-application-password',
					},
				},
			},
		}),
	},
	continue: {
		label: __('Continue', 'surecart'),
		configPath: '~/.continue/config.yaml or config.json',
		getConfig: (mcpUrl, username) => ({
			mcpServers: [
				{
					name: 'surecart',
					command: 'npx',
					args: getMcpArgs(mcpUrl),
					env: {
						WP_API_URL: mcpUrl,
						WP_API_USERNAME: username,
						WP_API_PASSWORD: 'your-application-password',
					},
				},
			],
		}),
	},
	other: {
		label: __('Other', 'surecart'),
		configPath: __("Your client's MCP configuration file", 'surecart'),
		getConfig: (mcpUrl, username) => ({
			mcpServers: {
				surecart: {
					command: 'npx',
					args: getMcpArgs(mcpUrl),
					env: {
						WP_API_URL: mcpUrl,
						WP_API_USERNAME: username,
						WP_API_PASSWORD: 'your-application-password',
					},
				},
			},
		}),
	},
};

/**
 * Build the choices array for ScSelect from AI_CLIENTS.
 */
const clientChoices = Object.entries(AI_CLIENTS).map(([key, { label }]) => ({
	value: key,
	label,
}));

export default ({ restUrl, appPasswordsUrl }) => {
	const [selectedClient, setSelectedClient] = useState('claude_desktop');
	const [copied, setCopied] = useState(false);

	const mcpUrl = restUrl;
	const currentUsername = window.wp?.data
		?.select?.('core')
		?.getCurrentUser?.()?.slug;

	const client = AI_CLIENTS[selectedClient];
	const config = client.getConfig(mcpUrl, currentUsername);
	const configJson = JSON.stringify(config, null, 2);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(configJson);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			// Fallback for older browsers or non-HTTPS contexts.
			const textarea = document.createElement('textarea');
			textarea.value = configJson;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const isClaudeCode = selectedClient === 'claude_code';

	return (
		<SettingsBox
			title={__('Connect Your AI Client', 'surecart')}
			description={__(
				'Follow the instructions below to connect your AI client to SureCart.',
				'surecart'
			)}
			noButton
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: var(--sc-spacing-large);
				`}
			>
				<ScSelect
					label={__('AI Client', 'surecart')}
					value={selectedClient}
					onScChange={(e) => setSelectedClient(e.target.value)}
					unselect={false}
					choices={clientChoices}
				/>

				<ol
					css={css`
						margin: 0;
						padding: 0 0 0 1.5em;
						display: flex;
						flex-direction: column;
						gap: var(--sc-spacing-medium);
					`}
				>
					{/* Step 1: Create Application Password */}
					<li>
						<div
							css={css`
								display: flex;
								flex-direction: column;
								gap: var(--sc-spacing-small);
							`}
						>
							<ScText
								style={{
									'--font-weight': '600',
									'--color': 'var(--sc-color-gray-800)',
								}}
							>
								{__(
									'Create an Application Password',
									'surecart'
								)}
							</ScText>
							<p
								css={css`
									margin: 0;
									color: var(--sc-color-gray-600);
									font-size: 0.9em;
								`}
							>
								<a
									href={appPasswordsUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									{__(
										'Open Application Passwords',
										'surecart'
									)}
								</a>
							</p>
						</div>
					</li>

					{/* Step 2 (Claude Code only): CLI command */}
					{isClaudeCode && client.cliCommand && (
						<li>
							<div
								css={css`
									display: flex;
									flex-direction: column;
									gap: var(--sc-spacing-small);
								`}
							>
								<ScText
									style={{
										'--font-weight': '600',
										'--color': 'var(--sc-color-gray-800)',
									}}
								>
									{__(
										'Or use this CLI command to add the server quickly (you will still need to set the environment variables):',
										'surecart'
									)}
								</ScText>
								<pre
									css={css`
										background: var(--sc-color-gray-100);
										border: 1px solid
											var(--sc-color-gray-300);
										border-radius: var(
											--sc-border-radius-medium
										);
										padding: var(--sc-spacing-medium);
										overflow-x: auto;
										font-size: 0.85em;
										line-height: 1.5;
										margin: 0;
									`}
								>
									{client.cliCommand(mcpUrl)}
								</pre>
							</div>
						</li>
					)}

					{/* Copy config step */}
					<li>
						<div
							css={css`
								display: flex;
								flex-direction: column;
								gap: var(--sc-spacing-small);
							`}
						>
							<ScText
								style={{
									'--font-weight': '600',
									'--color': 'var(--sc-color-gray-800)',
								}}
							>
								{__(
									'Copy the JSON config below into:',
									'surecart'
								)}
							</ScText>
							<code
								css={css`
									background: var(--sc-color-gray-100);
									padding: 2px 6px;
									border-radius: var(
										--sc-border-radius-small
									);
									font-size: 0.85em;
									color: var(--sc-color-gray-700);
								`}
							>
								{client.configPath}
							</code>
							{/* JSON config block */}
							<div
								css={css`
									position: relative;
								`}
							>
								<pre
									css={css`
										background: var(--sc-color-gray-900);
										color: var(--sc-color-gray-100);
										border-radius: var(
											--sc-border-radius-medium
										);
										padding: var(--sc-spacing-large);
										padding-right: 5em;
										overflow-x: auto;
										font-size: 0.85em;
										line-height: 1.5;
										margin: 0;
									`}
								>
									{configJson}
								</pre>
								<div
									css={css`
										position: absolute;
										top: var(--sc-spacing-small);
										right: var(--sc-spacing-small);
										z-index: 1;
									`}
								>
									<ScButton size="small" onClick={handleCopy}>
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
						</div>
					</li>

					{/* Replace password step */}
					<li>
						<ScText
							style={{
								'--font-weight': '600',
								'--color': 'var(--sc-color-gray-800)',
							}}
						>
							{__(
								'Replace "your-application-password" with the password from Step 1.',
								'surecart'
							)}
						</ScText>
					</li>
				</ol>

				<ScAlert open type="info">
					<div
						css={css`
							line-height: 1.6;
							display: flex;
							flex-direction: column;
							gap: 6px;
						`}
					>
						<div>
							<strong>WP_API_URL</strong>
							{' — '}
							{__("your site's MCP endpoint.", 'surecart')}{' '}
							<strong>WP_API_USERNAME</strong>
							{' — '}
							{__('your WordPress username.', 'surecart')}{' '}
							<strong>WP_API_PASSWORD</strong>
							{' — '}
							{__(
								'the application password you generated.',
								'surecart'
							)}
						</div>
						<div>
							{__(
								'Requires Node.js 20.1+. Verify with',
								'surecart'
							)}{' '}
							<code>node -v</code>
							{__(' in your terminal.', 'surecart')}{' '}
							{__(
								'If you have an older version, remove or switch it using nvm (e.g.',
								'surecart'
							)}{' '}
							<code>nvm install 20 && nvm use 20</code>
							{__(') before connecting.', 'surecart')}
						</div>
					</div>
				</ScAlert>

				{mcpUrl && mcpUrl.startsWith('http://') && (
					<ScAlert open type="warning">
						<span
							css={css`
								line-height: 1.5;
							`}
						>
							{__(
								'Your site is running over HTTP (likely a local dev environment). The config above includes the',
								'surecart'
							)}{' '}
							<code>--allow-http</code>{' '}
							{__(
								'flag to allow the connection. This flag is not needed — and will not appear — on production sites using HTTPS.',
								'surecart'
							)}
						</span>
					</ScAlert>
				)}
			</div>
		</SettingsBox>
	);
};
