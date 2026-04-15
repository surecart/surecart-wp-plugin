/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import CodeBlockWithCopy from './CodeBlockWithCopy';
import EnvVarsStep from './EnvVarsStep';
import NodeVersionStep from './NodeVersionStep';

/**
 * Claude Code-specific setup steps (Steps 2-5).
 */
export default function ({ mcpUrl, configJson, copied, onCopy }) {
	return (
		<>
			{/* Step 2 — Register MCP server via CLI */}
			<li>
				<strong>
					{__(
						'Register the MCP server via CLI (required)',
						'surecart'
					)}
				</strong>
				<ol>
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
									'Terminal app (Applications \u2192 Utilities \u2192 Terminal)',
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
								{__(
									'your preferred terminal emulator',
									'surecart'
								)}
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
				<ol>
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
								<strong>
									{__('macOS / Linux:', 'surecart')}
								</strong>{' '}
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
										'Note: files starting with . are hidden \u2014 press Cmd + Shift + . in Finder to show them.',
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

			<EnvVarsStep />
			<NodeVersionStep />
		</>
	);
}
