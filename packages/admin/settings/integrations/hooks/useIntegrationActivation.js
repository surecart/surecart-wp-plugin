import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEntityRecord } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Hook for managing integration/plugin/theme activation
 *
 * @param {Object} record - The integration record
 * @param {Object} options - Configuration options
 * @param {Function} options.onActivated - Callback when activation completes successfully
 * @param {Function} options.onSuccess - Callback with success message when plugin activated
 * @param {Function} options.onError - Callback with error when activation fails
 *
 * @returns {Object} Activation state and handlers
 */
export default function useIntegrationActivation(
	record,
	{ onActivated, onSuccess, onError } = {}
) {
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);

	// Only fetch plugin data if this is a plugin activation
	const shouldFetchPlugin = record?.activation_type === 'plugin';
	const { record: pluginData, hasResolved } = useEntityRecord(
		'root',
		'plugin',
		shouldFetchPlugin ? record?.plugin_file?.replace(/\.php$/, '') : null,
		{ enabled: shouldFetchPlugin }
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
		if (record?.activation_type !== 'plugin') {
			const err = new Error('Only plugins can be activated directly');
			setError(err);
			onError?.(err);
			return;
		}

		try {
			setError(null);
			setIsSaving(true);

			const wasInactive = record?.status === 'inactive';

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

			// Success - call callbacks directly
			onActivated?.();

			const message = wasInactive
				? 'Plugin activated.'
				: 'Plugin installed and activated.';
			onSuccess?.(message);
		} catch (err) {
			console.error(err);
			await invalidateResolutionForStore();
			// Don't set error for invalid_json errors (common with plugin activation redirects)
			if (err?.code !== 'invalid_json') {
				setError(err);
				onError?.(err);
			}
		} finally {
			setIsSaving(false);
		}
	};

	return {
		isLoading:
			(record?.activation_type === 'plugin' && !hasResolved) || isSaving,
		activate,
		activationLink,
		activationType: record?.activation_type,
	};
}
