/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import {
	ScSwitch,
	ScTextarea,
	ScInput,
	ScSelect,
	ScDialog,
	ScRadioGroup,
	ScRadio,
	ScPriceInput,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default () => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [error, setError] = useState(null);
	const [trackingScriptDialog, setTrackingScriptDialog] = useState(false);
	const { save } = useSave();
	const {
		item: affiliationProtocolItem,
		itemError: affiliationProtocolItemError,
		editItem: editAffiliationProtocolItem,
		hasLoadedItem: hasLoadedAffiliationProtocolItem,
	} = useEntity('store', 'affiliation_protocol');

	const type = affiliationProtocolItem?.amount_commission
		? 'fixed'
		: 'percentage';

	const [commisionType, setCommisionType] = useState(null);

	const signupsUrl = 'https://affiliates.surecart.com/join/new-test-store';
	const successFunction = () => {
		setTrackingScriptDialog(false);
		createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		});
	};
	const signupsUrlRef = useCopyToClipboard(signupsUrl, successFunction);
	const trackingScript = `<script>window.SureCartAffiliatesConfig = {"publicToken":"pt_vihbRpGvy8e5BprY2ukthxgM"};</script> <script src="https://js.surecart.com/v1/affiliates" defer></script>`;
	const trackingScriptRef = useCopyToClipboard(
		trackingScript,
		successFunction
	);
	useEffect(() => {
		setCommisionType(type);
	}, [type]);

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
						'What question do you want to ask affiliates on the signup form.',
						'surecart'
					)}
					placeholder={__(
						'How will you promote this store?',
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
					value={signupsUrl}
				>
					<ScButton
						type="text"
						circle
						slot="suffix"
						size="small"
						ref={signupsUrlRef}
					>
						<ScIcon name="clipboard" />
					</ScButton>
				</ScInput>
			</SettingsBox>
			<SettingsBox
				title={__('Referral Tracking', 'surecart')}
				description={__(
					'Configure how clicks are tracked and how referrals are credited to affiliates.',
					'surecart'
				)}
				loading={!hasLoadedAffiliationProtocolItem}
			>
				<ScSwitch
					checked={
						affiliationProtocolItem?.wordpress_plugin_tracking_enabled
					}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							wordpress_plugin_tracking_enabled:
								!affiliationProtocolItem?.wordpress_plugin_tracking_enabled,
						});
					}}
				>
					{__('Tracking', 'surecart')}
					<span
						slot="description"
						css={css`
							display: inline-flex;
							gap: var(--sc-spacing-x-small);
							margin: 0;
						`}
						style={{ lineHeight: '1.4' }}
					>
						{__(
							'Track affiliate referrals on this site.',
							'surecart'
						)}
						<span
							css={css`
								text-decoration: underline;
								cursor: pointer;
							`}
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setTrackingScriptDialog(true);
							}}
						>
							{__(
								'Want to add tracking to a different site?',
								'surecart'
							)}
						</span>
					</span>
				</ScSwitch>
				<ScDialog
					open={trackingScriptDialog}
					onScRequestClose={() => setTrackingScriptDialog(false)}
					label={__('Tracking Script', 'surecart')}
				>
					<ScTextarea
						help={__(
							"Copy and paste the tracking code into the <head> or before the closing </body> tag of your website. This should only be added to sites that don't have the script added by the WordPress plugin.",
							'surecart'
						)}
						readonly
						value={trackingScript}
					/>
					<div
						css={css`
							display: flex;
							justify-content: flex-end;
						`}
					>
						<ScButton type="primary" ref={trackingScriptRef}>
							<ScIcon name="clipboard" slot="prefix" />
							{__('Copy', 'surecart')}
						</ScButton>
					</div>
				</ScDialog>
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
					>
						<span slot="suffix">{__('days', 'surecart')}</span>
					</ScInput>
				</div>
				<ScSwitch
					checked={affiliationProtocolItem?.auto_approve_referrals}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							auto_approve_referrals:
								!affiliationProtocolItem?.auto_approve_referrals,
						});
					}}
				>
					{__('Auto Approve New Referrals', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Do you want to automatically approve new referrals? If disabled, you will need to manually approve each referral.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScInput
					label={__('Affiliate Referral URL', 'surecart')}
					help={__(
						'Where should affiliates send their traffic? This URL will be used to generate the affiliate referral link for each affiliate with their unique affiliate code.',
						'surecart'
					)}
					type="url"
					onScInput={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							referral_url: e.target.value,
						});
					}}
					value={affiliationProtocolItem?.referral_url}
				/>
			</SettingsBox>
			<SettingsBox
				title={__('Commissions & Payouts', 'surecart')}
				description={__(
					'Configure how affiliates earn commissions and how they get paid.',
					'surecart'
				)}
				loading={!hasLoadedAffiliationProtocolItem}
			>
				<ScRadioGroup
					label={__('Choose a Commission type', 'surecart')}
					onScChange={(e) => setCommisionType(e.target.value)}
				>
					<ScRadio
						value="percentage"
						checked={commisionType === 'percentage'}
					>
						{__('Percentage', 'surecart')}
					</ScRadio>
					<ScRadio value="fixed" checked={commisionType === 'fixed'}>
						{__('Flat Rate', 'surecart')}
					</ScRadio>
				</ScRadioGroup>
				{commisionType === 'percentage' ? (
					<ScInput
						type="number"
						min="0"
						disabled={commisionType !== 'percentage'}
						max="100"
						attribute="percent_commission"
						label={__('Percent Commission', 'surecart')}
						value={
							affiliationProtocolItem?.percent_commission || null
						}
						onScInput={(e) => {
							editAffiliationProtocolItem({
								percent_commission: e.target.value,
								amount_commission: null,
							});
						}}
						required={commisionType === 'percentage'}
					>
						<span slot="suffix">%</span>
					</ScInput>
				) : (
					<ScPriceInput
						currencyCode={scData?.currency}
						disabled={commisionType === 'percentage'}
						attribute="amount_commission"
						label={__('Amount Commission', 'surecart')}
						value={
							affiliationProtocolItem?.amount_commission ||
							null ||
							null
						}
						required={commisionType === 'fixed'}
						onScInput={(e) => {
							editAffiliationProtocolItem({
								amount_commission: e.target.value,
								percent_commission: null,
							});
						}}
					/>
				)}
				<ScSwitch
					checked={
						affiliationProtocolItem?.recurring_commissions_enabled
					}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							recurring_commissions_enabled:
								!affiliationProtocolItem?.recurring_commissions_enabled,
						});
					}}
				>
					{__('Subscription Commissions', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Do you want to award commissions on subscription renewal payments?',
							'surecart'
						)}
					</span>
				</ScSwitch>
				{affiliationProtocolItem?.recurring_commissions_enabled && (
					<ScInput
						label={__(
							'Subscription Commission Duration',
							'surecart'
						)}
						help={__(
							'For how long should subscription commissions be awarded? (Leave empty if you want to award commissions forever.)',
							'surecart'
						)}
						type="number"
						onScInput={(e) => {
							e.preventDefault();
							editAffiliationProtocolItem({
								recurring_commission_days: e.target.value,
							});
						}}
						value={
							affiliationProtocolItem?.recurring_commission_days
						}
					/>
				)}
				<ScSwitch
					checked={
						affiliationProtocolItem?.repeat_customer_commissions_enabled
					}
					onClick={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							repeat_customer_commissions_enabled:
								!affiliationProtocolItem?.repeat_customer_commissions_enabled,
						});
					}}
				>
					{__('Lifetime Commissions', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Do you want to award commissions on future purchases?',
							'surecart'
						)}
					</span>
				</ScSwitch>
				{affiliationProtocolItem?.repeat_customer_commissions_enabled && (
					<ScInput
						label={__('Lifetime Commission Duration', 'surecart')}
						help={__(
							'For how long should future purchase commissions be awarded? (Leave empty if you want to award commission forever.))',
							'surecart'
						)}
						type="number"
						onScInput={(e) => {
							e.preventDefault();
							editAffiliationProtocolItem({
								repeat_customer_commission_days: e.target.value,
							});
						}}
						value={
							affiliationProtocolItem?.repeat_customer_commission_days
						}
					/>
				)}
				<ScTextarea
					label={__('Payout Instructions', 'surecart')}
					help={__(
						'Let affiliates know how they will be paid, how often, and any terms or conditions for payment. These details will be shown to affiliates so they know what to expect.',
						'surecart'
					)}
					onScInput={(e) => {
						e.preventDefault();
						editAffiliationProtocolItem({
							payout_description: e.target.value,
						});
					}}
					value={affiliationProtocolItem?.payout_description}
					name="payout_description"
				/>
			</SettingsBox>
		</SettingsTemplate>
	);
};
