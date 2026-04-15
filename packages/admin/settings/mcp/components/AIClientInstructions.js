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

/**
 * Reusable CSS for sub-step ordered lists (lower-roman).
 */
const subStepsCss = css`
	margin: var(--sc-spacing-small) 0 0;
	padding-left: 1.25em;
	list-style: lower-roman;
	color: var(--sc-color-gray-700);
	line-height: 1.6;

	li {
		padding: 2px 0;
	}
`;

/**
 * Reusable CSS for the numbered-step <ol>.
 */
const stepsOlCss = css`
	list-style: none;
	counter-reset: steps;
	margin: 0;
	padding: 0;

	& > li {
		counter-increment: steps;
		position: relative;
		padding-left: 48px;
		padding-bottom: var(--sc-spacing-large);
	}

	& > li:last-child {
		padding-bottom: 0;
	}

	& > li > :first-child {
		line-height: 28px;
		margin-top: 0;
	}

	/* Circled number */
	& > li::before {
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
	& > li::after {
		content: '';
		position: absolute;
		left: 13px;
		top: 28px;
		bottom: 0;
		width: 2px;
		background: var(--sc-color-gray-200);
	}

	& > li:last-child::after {
		display: none;
	}
`;

/**
 * Dark code block CSS.
 */
const codeBlockCss = css`
	padding: 1em;
	padding-right: 5em;
	background-color: var(--sc-color-gray-900);
	color: var(--sc-color-gray-100);
	margin: 0;
	overflow: auto;
	border-radius: var(--sc-border-radius-medium);
`;

/**
 * Renders a <pre> block with an absolute-positioned Copy button.
 */
const CodeBlockWithCopy = ({ content, copied, onCopy }) => (
	<div
		css={css`
			position: relative;
			margin-top: var(--sc-spacing-small);
		`}
	>
		<pre css={codeBlockCss}>{content}</pre>
		<div
			css={css`
				position: absolute;
				top: var(--sc-spacing-small);
				right: var(--sc-spacing-small);
			`}
		>
			<ScButton size="small" onClick={onCopy}>
				<ScIcon name={copied ? 'check' : 'copy'} slot="prefix" />
				{copied ? __('Copied!', 'surecart') : __('Copy', 'surecart')}
			</ScButton>
		</div>
	</div>
);

/**
 * Step 1 — Create an Application Password (shared across all clients).
 */
const AppPasswordStep = ({ appPasswordsUrl, clientLabel }) => (
	<li>
		<strong>{__('Create an Application Password', 'surecart')}</strong>
		<ol css={subStepsCss}>
			<li>
				<ExternalLink href={appPasswordsUrl}>
					{__('Open Application Passwords', 'surecart')}
				</ExternalLink>{' '}
				{__('to go to your WordPress profile.', 'surecart')}
			</li>
			<li>
				{__(
					'In the "New Application Password Name" field, enter a recognizable name (e.g.',
					'surecart'
				)}{' '}
				<code>{clientLabel}</code>
				{').'}
			</li>
			<li>
				{__('Click', 'surecart')}{' '}
				<strong>{__('Add Application Password', 'surecart')}</strong>.
			</li>
			<li>
				{__(
					'Copy the generated password immediately — it will not be shown again.',
					'surecart'
				)}
			</li>
		</ol>
	</li>
);

/**
 * Verify Node.js version step (shared across all clients).
 */
const VerifyNodeStep = () => (
	<li>
		<strong>{__('Verify Node.js version', 'surecart')}</strong>
		<ol css={subStepsCss}>
			<li>
				{__('In your terminal, run:', 'surecart')} <code>node -v</code>
			</li>
			<li>{__('The version must be 20.1 or higher.', 'surecart')}</li>
			<li>
				{__('If it is lower, run:', 'surecart')}{' '}
				<code>nvm install 20 && nvm use 20</code>
			</li>
		</ol>
	</li>
);

/**
 * Claude Code-specific setup steps (Steps 2–4).
 */
const ClaudeCodeSteps = ({ mcpUrl, configJson, copied, onCopy }) => (
	<>
		{/* Step 2 — Register MCP server via CLI */}
		<li>
			<strong>
				{__('Register the MCP server via CLI (required)', 'surecart')}
			</strong>
			<ol css={subStepsCss}>
				<li>
					{__('Open your terminal:', 'surecart')}
					<ul
						css={css`
							margin: 4px 0 0;
							padding-left: 1.25em;
							list-style: disc;
							line-height: 1.6;
						`}
					>
						<li>
							<strong>{__('macOS', 'surecart')}</strong>
							{': '}
							{__(
								'Terminal app (Applications → Utilities → Terminal)',
								'surecart'
							)}
						</li>
						<li>
							<strong>{__('Windows', 'surecart')}</strong>
							{': '}
							{__('Command Prompt or PowerShell', 'surecart')}
						</li>
						<li>
							<strong>{__('Linux', 'surecart')}</strong>
							{': '}
							{__('your preferred terminal emulator', 'surecart')}
						</li>
					</ul>
				</li>
				<li>
					{__('Run the following command:', 'surecart')}
					<pre
						css={css`
							padding: 1em;
							background-color: var(--sc-color-gray-900);
							color: var(--sc-color-gray-100);
							margin: var(--sc-spacing-x-small) 0 0;
							overflow: auto;
							border-radius: var(--sc-border-radius-medium);
						`}
					>
						{`claude mcp add surecart -- npx -y @automattic/mcp-wordpress-remote@latest${
							mcpUrl && mcpUrl.startsWith('http://')
								? ' --allow-http'
								: ''
						}`}
					</pre>
				</li>
				<li>
					{__(
						'This registers the SureCart MCP server but does',
						'surecart'
					)}{' '}
					<strong>{__('NOT', 'surecart')}</strong>{' '}
					{__(
						'set your credentials. You must also complete Step 3.',
						'surecart'
					)}
				</li>
			</ol>
		</li>

		{/* Step 3 — Add credentials to JSON config */}
		<li>
			<strong>
				{__(
					'Add your credentials to the JSON config (required)',
					'surecart'
				)}
			</strong>
			<ol css={subStepsCss}>
				<li>
					{__(
						'Locate and open the MCP config file in a text editor:',
						'surecart'
					)}
					<div
						css={css`
							margin: var(--sc-spacing-x-small) 0 0;
							padding: 1em;
							background: var(--sc-color-gray-50);
							border: 1px solid var(--sc-color-gray-200);
							border-radius: var(--sc-border-radius-medium);
							font-size: var(--sc-font-size-small);
							line-height: 1.7;
						`}
					>
						<div>
							<strong>
								{__(
									'Per project (applies only to that project):',
									'surecart'
								)}
							</strong>
							<br />
							<code>.mcp.json</code>{' '}
							{__('in your project root folder', 'surecart')}
						</div>
						<div
							css={css`
								margin-top: var(--sc-spacing-small);
							`}
						>
							<strong>
								{__(
									'Global (applies to all projects):',
									'surecart'
								)}
							</strong>
						</div>
						<div
							css={css`
								margin-top: 4px;
								padding-left: 0.5em;
							`}
						>
							<strong>{__('macOS / Linux:', 'surecart')}</strong>{' '}
							<code>~/.claude.json</code>
							<br />
							<span
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{__(
									'Tip: ~ means your home folder, e.g. /Users/yourname/.claude.json',
									'surecart'
								)}
								<br />
								{__(
									'Note: files starting with . are hidden — press Cmd + Shift + . in Finder to show them.',
									'surecart'
								)}
							</span>
						</div>
						<div
							css={css`
								margin-top: 4px;
								padding-left: 0.5em;
							`}
						>
							<strong>{__('Windows:', 'surecart')}</strong>{' '}
							<code>
								{'C:\\Users\\YourUsername\\.claude.json'}
							</code>
							<br />
							<span
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{__(
									'Tip: open File Explorer, paste this path in the address bar, replacing "YourUsername" with your Windows username.',
									'surecart'
								)}
							</span>
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
			<CodeBlockWithCopy
				content={configJson}
				copied={copied}
				onCopy={onCopy}
			/>
		</li>

		{/* Step 4 — Update environment variables */}
		<li>
			<strong>
				{__('Update the environment variables', 'surecart')}
			</strong>
			<ol css={subStepsCss}>
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

		{/* Step 5 — Verify Node.js version */}
		<VerifyNodeStep />
	</>
);

/**
 * Default steps for non–Claude Code clients (Steps 2–3).
 */
const DefaultClientSteps = ({
	client,
	isClaudeDesktop,
	configJson,
	copied,
	onCopy,
}) => (
	<>
		{/* Copy config step — Claude Desktop gets expanded sub-steps */}
		<li>
			<strong>
				{isClaudeDesktop
					? __('Add the config to Claude Desktop', 'surecart')
					: __('Copy the JSON config below into:', 'surecart')}
			</strong>

			{isClaudeDesktop ? (
				<ol css={subStepsCss}>
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
			) : (
				<>
					<br />
					<code>{client.configPath}</code>
				</>
			)}

			<CodeBlockWithCopy
				content={configJson}
				copied={copied}
				onCopy={onCopy}
			/>
		</li>

		{/* Update environment variables step */}
		<li>
			<strong>
				{__('Update the environment variables', 'surecart')}
			</strong>
			<ol css={subStepsCss}>
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

		{/* Verify Node.js version step */}
		<VerifyNodeStep />
	</>
);

export default ({ restUrl, appPasswordsUrl }) => {
	const [selectedClient, setSelectedClient] = useState('claude_desktop');
	const [copied, setCopied] = useState(false);

	const mcpUrl = restUrl;
	const currentUsername = window.scMCPData?.current_username || '';

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
	const isClaudeDesktop = selectedClient === 'claude_desktop';

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
					overflow: hidden;
				`}
			>
				<ScSelect
					label={__('AI Client', 'surecart')}
					value={selectedClient}
					onScChange={(e) => setSelectedClient(e.target.value)}
					unselect={false}
					choices={clientChoices}
				/>

				<ol css={stepsOlCss}>
					{/* Step 1: Create Application Password (shared) */}
					<AppPasswordStep
						appPasswordsUrl={appPasswordsUrl}
						clientLabel={client.label}
					/>

					{/* Client-specific steps */}
					{isClaudeCode ? (
						<ClaudeCodeSteps
							mcpUrl={mcpUrl}
							configJson={configJson}
							copied={copied}
							onCopy={handleCopy}
						/>
					) : (
						<DefaultClientSteps
							client={client}
							isClaudeDesktop={isClaudeDesktop}
							configJson={configJson}
							copied={copied}
							onCopy={handleCopy}
						/>
					)}
				</ol>

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
