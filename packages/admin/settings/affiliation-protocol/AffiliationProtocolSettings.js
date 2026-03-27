/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import { __, sprintf } from '@wordpress/i18n';
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
	ScButton,
	ScIcon,
	ScFormControl,
} from '@surecart/components-react';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import CommissionStructure from '../../components/affiliates/commission/CommissionStructure';
import { Button } from '@wordpress/components';

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
	const { public_token } = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('surecart', 'store', 'account') ||
			{}
	);

	const signupsUrl = `https://${scData?.account_slug}.surecart.com/affiliates/sign_up`;
	const successFunction = () => {
		setTrackingScriptDialog(false);
		createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		});
	};
	const signupsUrlRef = useCopyToClipboard(signupsUrl, successFunction);
	const trackingScript = `<script>window.SureCartAffiliatesConfig = {"publicToken":"${public_token}"};</script> <script src="https://js.surecart.com/v1/affiliates" defer></script>`;
	const trackingScriptRef = useCopyToClipboard(
		trackingScript,
		successFunction
	);

	// Migrate legacy referral_url to referral_urls array on first load.
	// Intentionally omit affiliationProtocolItem from deps — this should only run once on initial load.
	useEffect(() => {
		if (
			hasLoadedAffiliationProtocolItem &&
			!affiliationProtocolItem?.referral_urls?.length &&
			affiliationProtocolItem?.referral_url
		) {
			editAffiliationProtocolItem({
				referral_urls: [affiliationProtocolItem.referral_url],
			});
		}
	}, [hasLoadedAffiliationProtocolItem]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			// Strip blank and duplicate URL entries before saving.
			editAffiliationProtocolItem({
				referral_urls: [
					...new Set(
						(affiliationProtocolItem?.referral_urls || []).filter(
							(url) => url.trim()
						)
					),
				],
			});

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
				<div>
					<ScInput
						label={__('Signup URL', 'surecart')}
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
					<div
						css={css`
							margin-top: var(--sc-input-label-margin);
							font-size: var(
								--sc-input-help-text-font-size-medium
							);
							line-height: var(--sc-line-height-dense);
							color: var(--sc-input-help-text-color);
						`}
					>
						{__(
							'This is where you will send affiliates to signup for your affiliate program. To change this URL slug, ',
							'surecart'
						)}
						<a
							href={addQueryArgs('admin.php', {
								page: 'sc-settings',
							})}
						>
							{__('click here', 'surecart')}
						</a>
						.
					</div>
				</div>
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
							"Copy and paste the tracking code into the <head> section or just before the closing </body> tag of your website. Ensure this is only added to sites that don't already have the script included via the WordPress plugin.",
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
				<ScFormControl
					label={__('Affiliate Referral URLs', 'surecart')}
				>
					<div
						css={css`
							color: var(--sc-input-help-text-color);
							font-size: var(
								--sc-input-help-text-font-size-medium
							);
							margin-bottom: var(--sc-spacing-x-small);
						`}
					>
						{__(
							'Where should affiliates send their traffic? These URLs will be used to generate the affiliate referral link for each affiliate with their unique affiliate code.',
							'surecart'
						)}
					</div>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: var(--sc-spacing-x-small);
						`}
					>
						{(affiliationProtocolItem?.referral_urls || []).map(
							(url, index) => (
								<div
									key={index}
									css={css`
										display: flex;
										align-items: center;
										gap: var(--sc-spacing-x-small);
									`}
								>
									<div
										css={css`
											flex: 1;
											min-width: 0;
										`}
									>
										<ScInput
											type="url"
											placeholder="https://example.com"
											onScInput={(e) => {
												e.preventDefault();
												const urls = [
													...(affiliationProtocolItem?.referral_urls ||
														[]),
												];
												urls[index] = e.target.value;
												editAffiliationProtocolItem({
													referral_urls: urls,
												});
											}}
											value={url}
										/>
									</div>
									<Button
										label={__('Remove URL', 'surecart')}
										aria-label={sprintf(
											__(
												'Remove referral URL %d',
												'surecart'
											),
											index + 1
										)}
										onClick={(e) => {
											e.preventDefault();
											editAffiliationProtocolItem({
												referral_urls: (
													affiliationProtocolItem?.referral_urls ||
													[]
												).filter((_, i) => i !== index),
											});
										}}
									>
										<ScIcon name="trash" />
									</Button>
								</div>
							)
						)}
						<div>
							<ScButton
								type="link"
								onClick={(e) => {
									e.preventDefault();
									editAffiliationProtocolItem({
										referral_urls: [
											...(affiliationProtocolItem?.referral_urls ||
												[]),
											'',
										],
									});
								}}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add URL', 'surecart')}
							</ScButton>
						</div>
					</div>
				</ScFormControl>
			</SettingsBox>
			<SettingsBox
				title={__('Commissions & Payouts', 'surecart')}
				description={__(
					'Configure how affiliates earn commissions and how they get paid.',
					'surecart'
				)}
				loading={!hasLoadedAffiliationProtocolItem}
			>
				<CommissionStructure
					commissionStructure={
						affiliationProtocolItem?.commission_structure
					}
					onChangeStructure={(value) => {
						editAffiliationProtocolItem({
							commission_structure: {
								...affiliationProtocolItem?.commission_structure,
								...value,
							},
						});
					}}
					onEditAffiliationProtocolItem={editAffiliationProtocolItem}
					zeroCommissionAmountReferral={
						affiliationProtocolItem?.zero_commission_amount_referrals_enabled
					}
				/>

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
