/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScIcon,
	ScSelect,
	ScAlert,
} from '@surecart/components-react';
import SettingsBox from '../../SettingsBox';

const AI_CLIENTS = {
	claude_desktop: {
		label: __('Claude Desktop', 'surecart'),
		configPath:
			'~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\claude_desktop_config.json (Windows)',
		getConfig: (mcpUrl, username) => ({
			mcpServers: {
				surecart: {
					command: 'npx',
					args: ['-y', '@automattic/mcp-wordpress-remote@latest'],
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
		cliCommand: () =>
			'claude mcp add surecart -- npx -y @automattic/mcp-wordpress-remote@latest',
		getConfig: (mcpUrl, username) => ({
			mcpServers: {
				surecart: {
					command: 'npx',
					args: ['-y', '@automattic/mcp-wordpress-remote@latest'],
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
					args: ['-y', '@automattic/mcp-wordpress-remote@latest'],
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
					args: ['-y', '@automattic/mcp-wordpress-remote@latest'],
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
					args: ['-y', '@automattic/mcp-wordpress-remote@latest'],
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
					args: ['-y', '@automattic/mcp-wordpress-remote@latest'],
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

export default ({ siteUrl, restNamespace, appPasswordsUrl }) => {
	const [selectedClient, setSelectedClient] = useState('claude_desktop');
	const [copied, setCopied] = useState(false);

	const mcpUrl = `${siteUrl}/wp-json/${restNamespace}/mcp`;
	const currentUser =
		window.scData?.username ||
		window.wp?.data?.select?.('core')?.getCurrentUser?.()?.username ||
		'admin';

	const client = AI_CLIENTS[selectedClient];
	const config = client.getConfig(mcpUrl, currentUser);
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

	// Step numbering shifts for Claude Code since it has an extra CLI step.
	const isClaudeCode = selectedClient === 'claude_code';
	const configStepNum = isClaudeCode ? 3 : 2;
	const replaceStepNum = isClaudeCode ? 4 : 3;

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

				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: var(--sc-spacing-medium);
					`}
				>
					{/* Step 1: Create Application Password */}
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: var(--sc-spacing-small);
						`}
					>
						<p
							css={css`
								margin: 0;
								font-weight: 600;
								color: var(--sc-color-gray-800);
							`}
						>
							{__(
								'1. Create an Application Password',
								'surecart'
							)}
						</p>
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
								{__('Open Application Passwords', 'surecart')}
							</a>
						</p>
					</div>

					{/* Step 2 (Claude Code only): CLI command */}
					{isClaudeCode && client.cliCommand && (
						<div
							css={css`
								display: flex;
								flex-direction: column;
								gap: var(--sc-spacing-small);
							`}
						>
							<p
								css={css`
									margin: 0;
									font-weight: 600;
									color: var(--sc-color-gray-800);
								`}
							>
								{__(
									'2. Or use this CLI command to add the server quickly (you will still need to set the environment variables):',
									'surecart'
								)}
							</p>
							<pre
								css={css`
									background: var(--sc-color-gray-100);
									border: 1px solid var(--sc-color-gray-300);
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
								{client.cliCommand()}
							</pre>
						</div>
					)}

					{/* Copy config step */}
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: var(--sc-spacing-small);
						`}
					>
						<p
							css={css`
								margin: 0;
								font-weight: 600;
								color: var(--sc-color-gray-800);
							`}
						>
							{`${configStepNum}. ${__(
								'Copy the JSON config below into:',
								'surecart'
							)}`}
						</p>
						<code
							css={css`
								background: var(--sc-color-gray-100);
								padding: 2px 6px;
								border-radius: var(--sc-border-radius-small);
								font-size: 0.85em;
								color: var(--sc-color-gray-700);
							`}
						>
							{client.configPath}
						</code>
					</div>

					{/* Replace password step */}
					<p
						css={css`
							margin: 0;
							font-weight: 600;
							color: var(--sc-color-gray-800);
						`}
					>
						{`${replaceStepNum}. ${__(
							'Replace "your-application-password" with the password from Step 1.',
							'surecart'
						)}`}
					</p>

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
								border-radius: var(--sc-border-radius-medium);
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

				<ScAlert open type="info">
					<span
						css={css`
							line-height: 1.5;
						`}
					>
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
					</span>
				</ScAlert>
			</div>
		</SettingsBox>
	);
};
