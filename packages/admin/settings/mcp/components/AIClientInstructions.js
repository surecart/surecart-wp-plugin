/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScSelect, ScAlert, ScProse } from '@surecart/components-react';
import SettingsBox from '../../SettingsBox';
import ClaudeDesktopSteps from './ClaudeDesktopSteps';
import ClaudeCodeSteps from './ClaudeCodeSteps';
import GenericClientSteps from './GenericClientSteps';
import AppPasswordStep from './AppPasswordStep';

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

/**
 * Build the common MCP server config object shared by all clients.
 */
const getServerConfig = (mcpUrl, username) => ({
	command: 'npx',
	args: getMcpArgs(mcpUrl),
	env: {
		WP_API_URL: mcpUrl,
		WP_API_USERNAME: username,
		WP_API_PASSWORD: 'your-application-password',
	},
});

const AI_CLIENTS = {
	claude_desktop: {
		label: __('Claude Desktop', 'surecart'),
		getConfig: (mcpUrl, username) => ({
			mcpServers: { surecart: getServerConfig(mcpUrl, username) },
		}),
	},
	claude_code: {
		label: __('Claude Code', 'surecart'),
		getConfig: (mcpUrl, username) => ({
			mcpServers: { surecart: getServerConfig(mcpUrl, username) },
		}),
	},
	cursor: {
		label: __('Cursor', 'surecart'),
		getConfig: (mcpUrl, username) => ({
			mcpServers: { surecart: getServerConfig(mcpUrl, username) },
		}),
	},
	vscode: {
		label: __('VS Code (Copilot)', 'surecart'),
		getConfig: (mcpUrl, username) => ({
			servers: { surecart: getServerConfig(mcpUrl, username) },
		}),
	},
	continue: {
		label: __('Continue', 'surecart'),
		getConfig: (mcpUrl, username) => ({
			mcpServers: [
				{ name: 'surecart', ...getServerConfig(mcpUrl, username) },
			],
		}),
	},
	other: {
		label: __('Other', 'surecart'),
		getConfig: (mcpUrl, username) => ({
			mcpServers: { surecart: getServerConfig(mcpUrl, username) },
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
 * Resolves the client-specific step component for the selected AI client.
 */
const getClientSteps = (selectedClient) => {
	switch (selectedClient) {
		case 'claude_desktop':
			return ClaudeDesktopSteps;
		case 'claude_code':
			return ClaudeCodeSteps;
		default:
			return GenericClientSteps;
	}
};

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

	const ClientSteps = getClientSteps(selectedClient);

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

				<ScProse>
					<ol css={stepsOlCss}>
						<AppPasswordStep
							appPasswordsUrl={appPasswordsUrl}
							clientLabel={client.label}
						/>

						<ClientSteps
							selectedClient={selectedClient}
							mcpUrl={mcpUrl}
							configJson={configJson}
							copied={copied}
							onCopy={handleCopy}
						/>
					</ol>
				</ScProse>

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
