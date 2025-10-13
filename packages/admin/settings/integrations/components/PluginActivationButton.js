import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useEntityRecord } from '@wordpress/core-data';
import { ScButton } from '@surecart/components-react';
import { useEffect } from 'react';

export default ({ plugin, slug, onActivated }) => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const previousStatus = useRef(null);
	const [isSaving, setIsSaving] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);

	const { record: pluginData, hasResolved } = useEntityRecord(
		'root',
		'plugin',
		plugin.replace(/\.php$/, '')
	);

	useEffect(() => {
		if (
			pluginData?.status === 'active' &&
			previousStatus.current !== 'active'
		) {
			onActivated?.();
		}
		previousStatus.current = pluginData?.status;
	}, [pluginData?.status]);

	const activatePlugin = async () => {
		try {
			setIsSaving(true);
			await saveEntityRecord(
				'root',
				'plugin',
				{
					...(pluginData ?? { slug }),
					status: 'active',
				},
				{
					throwOnError: true,
				}
			);
			// If we get here, it means the request was successful
			createSuccessNotice(
				pluginData
					? __('Plugin activated.', 'surecart')
					: __('Plugin installed and activated.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (error) {
			console.error(error);
			await invalidateResolutionForStore();
			if (error?.code === 'invalid_json') {
				return;
			} else {
				createErrorNotice(
					error?.message || __('Something went wrong', 'surecart'),
					{ type: 'snackbar' }
				);
			}
		} finally {
			setIsSaving(false);
		}
	};

	if (pluginData?.status === 'active') {
		return <ScButton type="text">{__('Enabled', 'surecart')}</ScButton>;
	}

	return (
		<ScButton
			type="primary"
			onClick={activatePlugin}
			disabled={!hasResolved || isSaving}
			busy={!hasResolved || isSaving}
		>
			{pluginData?.status === 'inactive'
				? __('Activate', 'surecart')
				: __('Install & Activate', 'surecart')}
		</ScButton>
	);
};
