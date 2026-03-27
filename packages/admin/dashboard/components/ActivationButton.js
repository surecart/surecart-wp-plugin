import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import useIntegrationActivation from '../../settings/integrations/hooks/useIntegrationActivation';

export default ({ record }) => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const { isLoading, activate, activationLink, canActivate } =
		useIntegrationActivation(record, {
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

	if (record?.status === 'active') {
		return (
			<ScButton disabled>
				<ScIcon name="check" slot="prefix" />
				{record?.button_text}
			</ScButton>
		);
	}

	// Active or pre-installed states (text button)
	if (['active', 'pre-installed'].includes(record?.status)) {
		return (
			<ScButton
				href={activationLink}
				target={activationLink ? '_blank' : undefined}
				disabled={!activationLink}
				aria-label={
					activationLink
						? `${record?.button_text} ${__(
								'(opens in new window)',
								'surecart'
						  )}`
						: record?.button_text
				}
			>
				{record?.button_text}
				{activationLink && (
					<ScIcon
						name="external-link"
						slot="suffix"
						aria-hidden="true"
					/>
				)}
			</ScButton>
		);
	}

	// Plugin activation (primary button with onClick)
	if (canActivate) {
		return (
			<ScButton onClick={activate} busy={isLoading}>
				{record?.button_text}
			</ScButton>
		);
	}

	// Theme/external activation (primary button with link)
	if (activationLink) {
		return (
			<ScButton
				href={activationLink}
				target="_blank"
				aria-label={`${record?.button_text} ${__(
					'(opens in new window)',
					'surecart'
				)}`}
			>
				{record?.button_text}
				<ScIcon
					name="arrow-up-right"
					slot="suffix"
					aria-hidden="true"
				/>
			</ScButton>
		);
	}

	return null;
};
