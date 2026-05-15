import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ExternalLink } from '@wordpress/components';
import { ScSwitch, ScAlert, ScIcon } from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useSave from '../UseSave';
import Error from '../../components/Error';
import { useEntityProp } from '@wordpress/core-data';
import MCPAdapterNotice from './components/MCPAdapterNotice';
import AIClientInstructions from './components/AIClientInstructions';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	// MCP settings from WP options.
	const [abilitiesEnabled, setAbilitiesEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_mcp_abilities_enabled'
	);
	const [editAbilitiesEnabled, setEditAbilitiesEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_mcp_edit_abilities_enabled'
	);
	const [deleteAbilitiesEnabled, setDeleteAbilitiesEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_mcp_delete_abilities_enabled'
	);

	const mcpData = window.scMCPData || {};
	const isAdapterActive = mcpData.mcp_adapter_active;
	const isAdapterInstalled = mcpData.mcp_adapter_installed;
	const abilitiesApiAvailable = mcpData.abilities_api_available;

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	// If the Abilities API is not available (WP < 6.9), show a notice.
	if (!abilitiesApiAvailable) {
		return (
			<SettingsTemplate
				title={__('MCP', 'surecart')}
				icon={<ScIcon name="cpu"></ScIcon>}
				onSubmit={onSubmit}
				noButton
			>
				<SettingsBox
					title={__('WordPress Update Required', 'surecart')}
					description={__(
						'AI integration requires a newer version of WordPress.',
						'surecart'
					)}
					noButton
				>
					<ScAlert type="warning" open>
						{__(
							'Please update WordPress to version 6.9 or later to use MCP and AI features. Your current WordPress version does not support the required AI integration APIs.',
							'surecart'
						)}
					</ScAlert>
				</SettingsBox>
			</SettingsTemplate>
		);
	}

	return (
		<SettingsTemplate
			title={__('MCP', 'surecart')}
			icon={<ScIcon name="cpu"></ScIcon>}
			onSubmit={onSubmit}
		>
			<Error error={error} setError={setError} margin="80px" />

			<SettingsBox
				title={__('Enable Abilities', 'surecart')}
				description={
					<>
						{__(
							'Choose what AI assistants are allowed to do with your store data.',
							'surecart'
						)}{' '}
						<ExternalLink href="https://surecart.com/docs/surecart-abilities/">
							{__('Learn more', 'surecart')}
						</ExternalLink>
					</>
				}
			>
				<ScSwitch
					checked={abilitiesEnabled}
					onScChange={(e) => setAbilitiesEnabled(e.target.checked)}
				>
					{__('Enable Abilities', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Allow AI assistants to interact with your store. When enabled, they can view, create, edit, and delete store data depending on the permissions below. When disabled, AI assistants cannot access your store at all.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{abilitiesEnabled && (
					<>
						<ScSwitch
							checked={editAbilitiesEnabled}
							onScChange={(e) =>
								setEditAbilitiesEnabled(e.target.checked)
							}
						>
							{__('Enable Edit Abilities', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									'Allow AI assistants to create new products, update prices, manage coupons, and modify other store data. When disabled, AI assistants can only view your data.',
									'surecart'
								)}
							</span>
						</ScSwitch>

						<ScSwitch
							checked={deleteAbilitiesEnabled}
							onScChange={(e) =>
								setDeleteAbilitiesEnabled(e.target.checked)
							}
						>
							{__('Enable Delete Abilities', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									'Allow AI assistants to permanently delete customers, coupons, promotions, and fulfillments. Deleted data cannot be recovered. When disabled, AI assistants cannot remove any data.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					</>
				)}
			</SettingsBox>

			{/* Adapter card is non-blocking — abilities are registered via wp_register_ability() regardless of which MCP server reads them. */}
			{!isAdapterActive && (
				<MCPAdapterNotice isInstalled={isAdapterInstalled} />
			)}

			{abilitiesEnabled && (
				<AIClientInstructions
					restUrl={mcpData.rest_url}
					appPasswordsUrl={mcpData.app_passwords_url}
					isAdapterActive={isAdapterActive}
				/>
			)}
		</SettingsTemplate>
	);
};
