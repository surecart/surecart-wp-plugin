import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import useIntegrationActivation from '../hooks/useIntegrationActivation';

export default ({ record, onActivated }) => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const { canActivate, isLoading, activate, activationLink, activationType } =
		useIntegrationActivation(record, {
			onActivated,
			onSuccess: (message) => {
				createSuccessNotice(__(message, 'surecart'), {
					type: 'snackbar',
				});
			},
			onError: (error) => {
				createErrorNotice(
					error?.message || __('Something went wrong', 'surecart'),
					{ type: 'snackbar' }
				);
			},
		});

	// Active or pre-installed states (text button)
	if (['active', 'pre-installed'].includes(record?.status)) {
		return (
			<ScButton
				type="text"
				href={activationLink}
				target={activationLink ? '_blank' : undefined}
				disabled={!activationLink}
			>
				{record?.button_text}
				{activationLink && (
					<ScIcon name="external-link" slot="suffix" />
				)}
			</ScButton>
		);
	}

	// Plugin activation (primary button with onClick)
	if (activationType === 'plugin') {
		return (
			<ScButton
				type="primary"
				onClick={activate}
				disabled={!canActivate}
				busy={isLoading}
			>
				{record?.button_text}
			</ScButton>
		);
	}

	// Theme/external activation (primary button with link)
	if (activationLink) {
		return (
			<ScButton type="primary" href={activationLink} target="_blank">
				{record?.button_text}
				<ScIcon name="external-link" slot="suffix" />
			</ScButton>
		);
	}

	return null;
};
