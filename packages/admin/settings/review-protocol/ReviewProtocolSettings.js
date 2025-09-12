/** @jsx jsx */
import { jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import SettingsTemplate from '../SettingsTemplate';
import createSettingsFactory from '../store';
import useValidationErrors from '@admin/hooks/useValidationErrors';
import SaveButton from '../SaveButton';
import apiFetch from '@wordpress/api-fetch';

const { useSaveSettings, useSettings } = createSettingsFactory('review_protocol', {
	reviews_enabled: false,
	solicit_reviews: false,
	solicit_reviews_after_days: 7,
});

const ReviewProtocolSettings = () => {
	const { state, setter } = useSettings();
	const { saveSettings, isBusy } = useSaveSettings();
	const { displayValidationErrors, clearValidationErrors } = useValidationErrors();

	const save = async () => {
		clearValidationErrors();
		try {
			await saveSettings();
			wp.data.dispatch('core/notices').createSuccessNotice(__('Settings saved successfully.', 'surecart'));
		} catch (error) {
			displayValidationErrors(error);
		}
	};

	return (
		<SettingsTemplate
			header={
				<SaveButton
					onClick={save}
					busy={isBusy}
					disabled={isBusy}
				>
					{__('Save', 'surecart')}
				</SaveButton>
			}
		>
			<sc-flex direction="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-x-large)' }}>
				<sc-flex direction="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-large)' }}>
					<sc-text style={{ '--font-size': 'var(--sc-font-size-large)', '--line-height': 'var(--sc-line-height-dense)', '--font-weight': 'var(--sc-font-weight-bold)' }}>
						{__('Reviews Settings', 'surecart')}
					</sc-text>

					<sc-flex direction="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-medium)' }}>
						<sc-form-control>
							<span slot="label">{__('Enable Reviews', 'surecart')}</span>
							<span slot="help">{__('Allow customers to leave reviews on products. Individual products must also have reviews enabled.', 'surecart')}</span>
							<sc-switch
								checked={state.reviews_enabled}
								onScChange={(e) => setter('reviews_enabled')(e.target.checked)}
							/>
						</sc-form-control>

						{state.reviews_enabled && (
							<>
								<sc-form-control>
									<span slot="label">{__('Solicit Reviews', 'surecart')}</span>
									<span slot="help">{__('Send automatic review request emails to customers after their order is fulfilled.', 'surecart')}</span>
									<sc-switch
										checked={state.solicit_reviews}
										onScChange={(e) => setter('solicit_reviews')(e.target.checked)}
									/>
								</sc-form-control>

								{state.solicit_reviews && (
									<sc-form-control>
										<span slot="label">{__('Days After Fulfillment', 'surecart')}</span>
										<span slot="help">{__('Number of days after order fulfillment to send review request email.', 'surecart')}</span>
										<sc-input
											type="number"
											value={state.solicit_reviews_after_days}
											onScInput={(e) => setter('solicit_reviews_after_days')(parseInt(e.target.value) || 7)}
											min="1"
											max="365"
										/>
									</sc-form-control>
								)}
							</>
						)}
					</sc-flex>
				</sc-flex>
			</sc-flex>
		</SettingsTemplate>
	);
};

export default ReviewProtocolSettings;