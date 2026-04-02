/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScButton, ScAlert, ScIcon } from '@surecart/components-react';
import SettingsBox from '../../SettingsBox';

const GITHUB_DOWNLOAD_URL =
	'https://github.com/WordPress/mcp-adapter/releases/latest/download/mcp-adapter.zip';
const GITHUB_REPO_URL = 'https://github.com/WordPress/mcp-adapter';

export default ({ isInstalled }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [lastAction, setLastAction] = useState(null);

	const mcpData = window.scMCPData || {};

	const handleAction = async (action) => {
		setLoading(true);
		setError(null);
		setSuccess(null);
		setLastAction(action);

		try {
			const response = await fetch(mcpData.ajax_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: `sc_mcp_adapter_${action}`,
					nonce: mcpData.nonce,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setSuccess(result.data.message);
				// Reload the page after a short delay to show the full MCP settings.
				setTimeout(() => {
					window.location.href = mcpData.settings_url;
				}, 1000);
			} else {
				setError(
					result.data?.message ||
						__('Something went wrong.', 'surecart')
				);
			}
		} catch (e) {
			setError(e.message || __('Something went wrong.', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<SettingsBox
			title={__('MCP', 'surecart')}
			description={__('Connect AI assistants to your store.', 'surecart')}
			noButton
		>
			{!!success && (
				<ScAlert type="success" open>
					{success}
				</ScAlert>
			)}

			{!success && (
				<>
					<p
						css={css`
							margin: 0 0 var(--sc-spacing-small);
							color: var(--sc-color-gray-700);
							line-height: 1.5;
						`}
					>
						{isInstalled
							? __(
									'The MCP Adapter plugin is installed but not active. Activate it to connect AI assistants to your store.',
									'surecart'
							  )
							: __(
									'The MCP Adapter plugin is needed to connect AI assistants like Claude and Cursor to your store. Install and activate it to get started.',
									'surecart'
							  )}
					</p>

					<div
						css={css`
							display: flex;
							align-items: center;
							gap: var(--sc-spacing-small);
							flex-wrap: wrap;
						`}
					>
						{isInstalled ? (
							<ScButton
								type="primary"
								loading={loading}
								onClick={() => handleAction('activate')}
							>
								{__('Activate MCP Adapter', 'surecart')}
							</ScButton>
						) : (
							<ScButton
								type="primary"
								loading={loading}
								onClick={() => handleAction('install')}
							>
								{__(
									'Install & Activate MCP Adapter',
									'surecart'
								)}
							</ScButton>
						)}
					</div>

					{/* Show error with manual fallback instructions */}
					{!!error && (
						<ScAlert type="danger" open>
							<span slot="title">
								{lastAction === 'activate'
									? __('Activation failed', 'surecart')
									: __('Installation failed', 'surecart')}
							</span>
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
									`}
								>
									{error}
								</p>
								<p
									css={css`
										margin: 0;
										line-height: 1.5;
									`}
								>
									{__(
										'You can install it manually:',
										'surecart'
									)}
								</p>
								<ol
									css={css`
										margin: 0;
										padding-left: 1.25em;
										line-height: 1.6;
									`}
								>
									<li>
										<a
											href={GITHUB_DOWNLOAD_URL}
											target="_blank"
											rel="noopener noreferrer"
										>
											{__(
												'Download MCP Adapter',
												'surecart'
											)}
										</a>{' '}
										{__(
											'from GitHub releases.',
											'surecart'
										)}
									</li>
									<li>
										{__(
											'Go to Plugins → Add New → Upload Plugin.',
											'surecart'
										)}
									</li>
									<li>
										{__(
											'Upload the ZIP file and activate the plugin.',
											'surecart'
										)}
									</li>
								</ol>
								<p
									css={css`
										margin: 0;
									`}
								>
									<a
										href={GITHUB_REPO_URL}
										target="_blank"
										rel="noopener noreferrer"
									>
										{__('View on GitHub', 'surecart')}{' '}
										<ScIcon
											name="external-link"
											style={{
												fontSize: '0.85em',
												verticalAlign: 'middle',
											}}
										/>
									</a>
								</p>
							</div>
						</ScAlert>
					)}
				</>
			)}
		</SettingsBox>
	);
};
