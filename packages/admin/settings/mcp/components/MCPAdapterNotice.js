/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScButton } from '@surecart/components-react';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import SettingsBox from '../../SettingsBox';

export default ({ isInstalled }) => {
	const [loading, setLoading] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { ajax_url, nonce, mcp_adapter_repo_url } = window.scMCPData || {};

	const handleAction = async (action) => {
		setLoading(true);

		try {
			const response = await fetch(ajax_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: `sc_mcp_adapter_${action}`,
					nonce,
				}),
			});

			const result = await response.json();

			// If the action was successful, redirect to the MCP settings page.
			if (!result.success) {
				throw new Error(
					result.data?.message ||
						__('Something went wrong.', 'surecart')
				);
			}

			// Redirect to the MCP settings page.
			window.location.reload();
		} catch (e) {
			createErrorNotice(
				`${e.message || __('Something went wrong.', 'surecart')} ${__(
					'You can install it manually:',
					'surecart'
				)}`,
				{
					actions: [
						{
							label: __('View on GitHub', 'surecart'),
							url: mcp_adapter_repo_url,
						},
					],
				}
			);
			setLoading(false);
		}
	};

	return (
		<SettingsBox
			title={__('MCP Server', 'surecart')}
			description={__(
				'Recommended: install the official MCP Adapter to expose abilities to AI assistants.',
				'surecart'
			)}
			noButton
		>
			<>
				<p
					css={css`
						margin: 0 0 var(--sc-spacing-small);
						color: var(--sc-color-gray-700);
						line-height: 1.5;
					`}
				>
					{__(
						'The MCP Adapter plugin is the easiest way to connect AI assistants like ChatGPT or Claude to your store. SureCart abilities are registered automatically — the adapter exposes them over a REST endpoint AI clients can call.',
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
							{__('Install & Activate MCP Adapter', 'surecart')}
						</ScButton>
					)}
				</div>
			</>
		</SettingsBox>
	);
};
