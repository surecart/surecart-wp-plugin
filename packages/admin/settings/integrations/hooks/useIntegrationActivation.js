import { useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEntityRecord } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Hook for managing integration/plugin/theme activation
 *
 * @param {Object} record - The integration record
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback with success message when plugin activated
 * @param {Function} options.onError - Callback with error when activation fails
 *
 * @returns {Object} Activation state and handlers
 */
export default function useIntegrationActivation(
	record,
	{ onSuccess, onError } = {}
) {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const { record: pluginData } = useEntityRecord(
		'root',
		'plugin',
		record?.plugin_file?.replace(/\.php$/, ''),
		{
			enabled: !!record?.plugin_file,
		}
	);

	// Compute activation link for themes and external integrations
	const activationLink = (() => {
		if (record?.activation_type === 'theme') {
			return addQueryArgs('theme-install.php', {
				theme: record?.theme_slug,
			});
		}
		if (
			record?.activation_type === 'external' ||
			record?.activation_type === 'pre-installed'
		) {
			return record?.activation_link || null;
		}
		return null;
	})();

	// Plugin activation function
	const activate = async () => {
		try {
			setIsSaving(true);

			await saveEntityRecord(
				'root',
				'plugin',
				{
					...(pluginData ?? { slug: record?.plugin_slug }),
					status: 'active',
				},
				{
					throwOnError: true,
				}
			);

			const baseURL = select(coreStore).getEntityConfig(
				'surecart',
				'integration_catalog'
			)?.baseURL;

			const updatedRecord = await apiFetch({
				path: `${baseURL}/${record.id}`,
			});

			receiveEntityRecords(
				'surecart',
				'integration_catalog',
				updatedRecord
			);

			onSuccess?.(__('Plugin activated.', 'surecart'));
		} catch (err) {
			console.error(err);
			// Don't set error for invalid_json errors (common with plugin activation redirects)
			if (err?.code !== 'invalid_json') {
				onError?.(err);
			}
		} finally {
			setIsSaving(false);
		}
	};

	const canActivate = (() => {
		// not a plugin file.
		if (!record?.plugin_file) {
			return false;
		}

		// if it's external and the plugin is inactive, we can activate it.
		if (activationLink) {
			return pluginData?.status === 'inactive';
		}

		return true;
	})();

	return {
		isLoading: isSaving,
		activate,
		canActivate,
		activationLink,
	};
}
