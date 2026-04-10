/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScIcon,
	ScSelect,
	ScAlert,
	ScProse,
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
						<ScProse>
							<strong>
								{__(
									'Create an Application Password',
									'surecart'
								)}
							</strong>
							<p>
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
						</ScProse>
					</li>

					{/* Step 2 (Claude Code only): CLI command */}
					{isClaudeCode && client.cliCommand && (
						<li>
							<ScProse>
								<strong>
									{__(
										'Or use this CLI command to add the server quickly (you will still need to set the environment variables):',
										'surecart'
									)}
								</strong>
								<pre
									style={{
										backgroundColor:
											'var(--sc-color-gray-100)',
										color: 'var(--sc-color-gray-800)',
										border: '1px solid var(--sc-color-gray-300)',
										margin: 0,
									}}
								>
									{client.cliCommand(mcpUrl)}
								</pre>
							</ScProse>
						</li>
					)}

					{/* Copy config step */}
					<li>
						<ScProse>
							<strong>
								{__(
									'Copy the JSON config below into:',
									'surecart'
								)}
							</strong>
							<br />
							<code>{client.configPath}</code>
						</ScProse>

						<div
							css={css`
								position: relative;
								margin-top: var(--sc-spacing-small);
							`}
						>
							<ScProse>
								<pre
									style={{
										paddingRight: '5em',
										backgroundColor:
											'var(--sc-color-gray-900)',
										color: 'var(--sc-color-gray-100)',
										margin: 0,
									}}
								>
									{configJson}
								</pre>
							</ScProse>
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
					</li>

					{/* Replace password step */}
					<li>
						<ScProse>
							<strong>
								{__(
									'Replace "your-application-password" with the password from Step 1.',
									'surecart'
								)}
							</strong>
						</ScProse>
					</li>
				</ol>

				<ScAlert open type="info">
					<ScProse>
						<p>
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
						</p>
						<p>
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
						</p>
					</ScProse>
				</ScAlert>

				{mcpUrl && mcpUrl.startsWith('http://') && (
					<ScAlert open type="warning">
						<ScProse>
							<p>
								{__(
									'Your site is running over HTTP (likely a local dev environment). The config above includes the',
									'surecart'
								)}{' '}
								<code>--allow-http</code>{' '}
								{__(
									'flag to allow the connection. This flag is not needed — and will not appear — on production sites using HTTPS.',
									'surecart'
								)}
							</p>
						</ScProse>
					</ScAlert>
				)}
			</div>
		</SettingsBox>
	);
};
