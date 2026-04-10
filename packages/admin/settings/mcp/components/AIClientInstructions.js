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
import { ExternalLink } from '@wordpress/components';

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
							list-style: none;
							counter-reset: steps;
							margin: 0;
							padding: 0;

							li {
								counter-increment: steps;
								position: relative;
								padding-left: 48px;
								padding-bottom: var(--sc-spacing-large);
							}

							li > p:first-child,
							li > p:first-child > strong {
								line-height: 28px;
								margin-top: 0;
							}

							li:last-child {
								padding-bottom: 0;
							}

							/* Circled number */
							li::before {
								content: counter(steps);
								position: absolute;
								left: 0;
								top: 0;
								width: 28px;
								height: 28px;
								border-radius: 50%;
								background: var(--sc-color-gray-200);
								color: var(--sc-color-gray-700);
								font-size: 13px;
								font-weight: 600;
								display: flex;
								align-items: center;
								justify-content: center;
								z-index: 1;
							}

							/* Vertical connector line */
							li::after {
								content: '';
								position: absolute;
								left: 13px;
								top: 28px;
								bottom: 0;
								width: 2px;
								background: var(--sc-color-gray-200);
							}

							li:last-child::after {
								display: none;
							}
						`}
					>
						{/* Step 1: Create Application Password */}
						<li>
							<p>
								<strong>
									{__(
										'Create an Application Password',
										'surecart'
									)}
								</strong>
							</p>
							<p>
								<ExternalLink
									href={appPasswordsUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									{__(
										'Open Application Passwords',
										'surecart'
									)}
								</ExternalLink>
							</p>
						</li>

						{/* Step 2 (Claude Code only): CLI command */}
						{isClaudeCode && client.cliCommand && (
							<li>
								<p>
									{__(
										'Or use this CLI command to add the server quickly (you will still need to set the environment variables):',
										'surecart'
									)}
								</p>
								<pre
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
									{client.cliCommand(mcpUrl)}
								</pre>
							</li>
						)}

						{/* Copy config step */}
						<li>
							<p>
								<strong>
									{__(
										'Copy the JSON config below into:',
										'surecart'
									)}
								</strong>
							</p>
							<code>{client.configPath}</code>
							{/* JSON config block */}
							<div
								css={css`
									position: relative;
								`}
							>
								<pre
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
						</li>

						{/* Replace password step */}
						<li>
							<p>
								<strong>
									{__(
										'Replace "your-application-password" with the password from Step 1.',
										'surecart'
									)}
								</strong>
							</p>
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
