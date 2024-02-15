/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import useEntity from '../../hooks/useEntity';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScSwitch,
	ScAlert,
	ScTextarea,
	ScInput,
	ScSelect,
} from '@surecart/components-react';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { editEntityRecord } = useDispatch(coreStore);
	const {
		item: affiliationProtocolItem,
		itemError: affiliationProtocolItemError,
		editItem: editAffiliationProtocolItem,
		hasLoadedItem: hasLoadedAffiliationProtocolItem,
	} = useEntity('store', 'affiliation_protocol');
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

	return (
		<SettingsTemplate
			title={__('Affiliates Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={affiliationProtocolItemError || error}
				setError={setError}
				margin="80px"
			/>
			<SettingsBox
				title={__('Affiliate Signups', 'surecart')}
				description={__(
					'Configure how affiliates signup and get approved to promote products in your store.',
					'surecart'
				)}
				loading={!hasLoadedAffiliationProtocolItem}
			>
				<ScSwitch
					checked={affiliationProtocolItem?.enabled}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							enabled: !affiliationProtocolItem?.enabled,
						});
					}}
				>
					{__('Allow New Affiliate Signups', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Do you want to allow new affiliates to sign up?',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScTextarea
					label={__('Program Description', 'surecart')}
					help={__(
						'Let affiliates know any specifics about your program and what to expect from being an affiliate. This is shown to affiliates when they sign up for your affiliate program.',
						'surecart'
					)}
					onScInput={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							description: e.target.value,
						});
					}}
					value={affiliationProtocolItem?.description}
					name="description"
				/>
				<ScInput
					label={__('Signup Question', 'surecart')}
					help={__(
						'What question do you want to ask affiliates on the signup form? If blank, the default question "How will you promote this store?" will be used.',
						'surecart'
					)}
					onScInput={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							affiliation_request_bio_label: e.target.value,
						});
					}}
					value={
						affiliationProtocolItem?.affiliation_request_bio_label
					}
				/>
				<ScInput
					label={__('Affiliate Terms URL', 'surecart')}
					help={__(
						'Where can affiliates find the terms and conditions for your affiliate program? If provided, this URL will be shown to affiliates when they sign up for your affiliate program.',
						'surecart'
					)}
					type="url"
					onScInput={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							terms_url: e.target.value,
						});
					}}
					value={affiliationProtocolItem?.terms_url}
				/>
				<ScSwitch
					checked={
						affiliationProtocolItem?.affiliation_request_payout_email_enabled
					}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							affiliation_request_payout_email_enabled:
								!affiliationProtocolItem?.affiliation_request_payout_email_enabled,
						});
					}}
				>
					{__('Payout Email Field on Signup', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Do you want to include the payout email field on the signup form?',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={affiliationProtocolItem?.auto_approve_affiliations}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							auto_approve_affiliations:
								!affiliationProtocolItem?.auto_approve_affiliations,
						});
					}}
				>
					{__('Auto Approve New Affiliates', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Do you want to automatically approve new affiliate signups? If disabled, you will need to manually approve each affiliate signup.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScInput
					label={__('Signup URL', 'surecart')}
					help={__(
						'This is where you will send affiliates to signup for your affiliate program.',
						'surecart'
					)}
					type="url"
					readonly
					value="https://affiliates.surecart.com/join/new-test-store"
				/>
			</SettingsBox>
			<SettingsBox
				title={__('Referral Tracking', 'surecart')}
				description={__(
					'Configure how clicks are tracked and how referrals are credited to affiliates.',
					'surecart'
				)}
				loading={!hasLoadedAffiliationProtocolItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScSelect
						value={affiliationProtocolItem?.referrer_type}
						onScChange={(e) =>
							editAffiliationProtocolItem({
								referrer_type: e.target.value,
							})
						}
						choices={[
							{
								value: 'first',
								label: __('First', 'surecart'),
							},
							{
								value: 'last',
								label: __('Last', 'surecart'),
							},
						]}
						label={__('Referrer Type', 'surecart')}
						help={__(
							'Should the first or last referrer be credited?',
							'surecart'
						)}
						required
					/>
					<ScInput
						label={__('Tracking Length', 'surecart')}
						help={__(
							'How many days should the tracking code last for?',
							'surecart'
						)}
						type="number"
						onScInput={(e) => {
							e.preventDefault();
							editAffiliationProtocolItem({
								tracking_length_days: e.target.value,
							});
						}}
						value={affiliationProtocolItem?.tracking_length_days}
					/>
				</div>
			</SettingsBox>
		</SettingsTemplate>
	);
};
