import { __ } from '@wordpress/i18n';
import CodeBlockWithCopy from './CodeBlockWithCopy';
import EnvVarsStep from './EnvVarsStep';
import NodeVersionStep from './NodeVersionStep';

/**
 * Claude Desktop-specific setup steps.
 */
export default function ({ configJson, copied, onCopy }) {
	return (
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
