/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScPremiumTag,
	ScSelect,
	ScSwitch,
	ScUpgradeRequired,
	ScFormControl,
	ScInput,
	ScDivider,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'subscription_protocol'
	);

	const {
		item: portalItem,
		itemError: portalItemError,
		editItem: portalEditItem,
		hasLoadedItem: portalHasLoadedItem,
	} = useEntity('store', 'customer_portal_protocol');

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

	const choices = [
		{
			label: __('Immediately', 'surecart'),
			value: 'immediate',
		},
		{
			label: __('Next Billing Period', 'surecart'),
			value: 'pending',
		},
	];

	return (
		<SettingsTemplate
			title={__('Subscriptions', 'surecart')}
			icon={<sc-icon name="refresh-ccw"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || portalItemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__(
					'Upgrades, Downgrades, and Cancellations',
					'surecart'
				)}
				description={__(
					'Manage how your store handles subscription upgrades, downgrades, and cancellations.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScSelect
						label={__('Downgrades Happen', 'surecart')}
						placeholder={__('Downgrades Happen', 'surecart')}
						value={item?.downgrade_behavior}
						onScChange={(e) =>
							editItem({ downgrade_behavior: e.target.value })
						}
						choices={choices}
						required
					></ScSelect>

					<ScSelect
						label={__('Upgrades Happen', 'surecart')}
						placeholder={__('Upgrades Happen', 'surecart')}
						value={item?.upgrade_behavior}
						onScChange={(e) =>
							editItem({ upgrade_behavior: e.target.value })
						}
						choices={choices}
						required
					></ScSelect>
				</div>

				<sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>
					{__(
						"When an upgrade or downgrade happens immediately, a prorated invoice will be generated and paid. If the invoice payment fails, the subscription will not be updated. In the case of a downgrade, the invoice will likely have a $0 balance and a credit may be applied to the customer. When an upgrade or downgrade happens at the next billing period, the subscription won't be updated until the next payment date.",
						'surecart'
					)}
				</sc-text>

				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScSelect
						label={__('Cancellations Happen', 'surecart')}
						placeholder={__('Cancellations Happen', 'surecart')}
						value={item?.cancel_behavior}
						onScChange={(e) =>
							editItem({ cancel_behavior: e.target.value })
						}
						choices={choices}
						required
					></ScSelect>
				</div>

				<sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>
					{__(
						'When a cancellation happens immediately, the subscription is canceled right away. When a cancellation happens at the billing period end, the subscription remains active until the end of the current billing period.',
						'surecart'
					)}
				</sc-text>

				<ScDivider />

				<ScUpgradeRequired
					required={!scData?.entitlements?.subscription_cancel_window}
				>
					<ScSwitch
						checked={item.cancel_window_enabled}
						onScChange={(e) => {
							e.preventDefault();
							editItem({
								cancel_window_enabled:
									!item.cancel_window_enabled,
							});
						}}
					>
						{__('Delay Self-Service Cancellations', 'surecart')}
						{!scData?.entitlements?.subscription_cancel_window && (
							<ScPremiumTag />
						)}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'The number of days prior to a subscription renewing that the cancel option will be visible to customers.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</ScUpgradeRequired>
				{!!item.cancel_window_enabled && (
					<ScInput
						value={item?.cancel_window_days}
						label={__(
							'Allow Self-Service Cancellations',
							'surecart'
						)}
						type="number"
						onScInput={(e) =>
							editItem({ cancel_window_days: e.target.value })
						}
						help={__(
							'Choose how many days before the subscription renewal customers can cancel their plan through the customer dashboard. For example, if you set this to 7 days, customers will only be able to cancel their subscription during the week it renews. Please check for the legality of this setting in your region before enabling.',
							'surecart'
						)}
						required
					>
						<span slot="suffix" style={{ opacity: '0.65' }}>
							{__('Days Before Renewal', 'surecart')}
						</span>
					</ScInput>
				)}
			</SettingsBox>

			<SettingsBox
				title={__('Subscription Renewals', 'surecart')}
				description={__(
					'Manage how your store subscription renewals.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScInput
					value={item?.remind_at_period_percent_remaining}
					label={__('Subscription Renewal Reminders', 'surecart')}
					type="number"
					min="0"
					max="100"
					onScInput={(e) =>
						editItem({
							remind_at_period_percent_remaining: e.target.value,
						})
					}
					help={__(
						'Specify the percentage of the subscription period remaining when a reminder should be sent to customers. For instance, entering 25% will trigger the reminder when 25% of the period is left.',
						'surecart'
					)}
					required
				>
					<span slot="suffix" style={{ opacity: '0.65' }}>
						{__('% of Period Remaining', 'surecart')}
					</span>
				</ScInput>
			</SettingsBox>

			<SettingsBox
				title={__('Failed Payments', 'surecart')}
				description={__(
					'Manage how your store handles failed subscription payments.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScSelect
						label={__('Cancel Subscriptions After', 'surecart')}
						value={item?.payment_retry_window_weeks}
						onScChange={(e) =>
							editItem({
								payment_retry_window_weeks: parseInt(
									e.target.value
								),
							})
						}
						choices={[
							{
								label: __('One Week', 'surecart'),
								value: 1,
							},
							{
								label: __('Two Weeks', 'surecart'),
								value: 2,
							},
							{
								label: __('Three Weeks', 'surecart'),
								value: 3,
							},
						]}
						required
					></ScSelect>
				</div>
				<sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>
					{__(
						'If a subscription payment fails, the subscription is marked past due. When this happens we automatically retry the payment based on our smart retry logic. If the payment is still unsuccessful after the duration set above, the subscription will be canceled.',
						'surecart'
					)}
				</sc-text>
			</SettingsBox>

			<SettingsBox
				title={__('Purchase Behavior', 'surecart')}
				description={__(
					'Manage your subscription purchase behavior.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScUpgradeRequired
					required={
						!scData?.entitlements?.optional_upfront_payment_method
					}
				>
					<ScSwitch
						checked={
							scData?.entitlements
								?.optional_upfront_payment_method
								? item?.require_upfront_payment_method
								: true
						}
						onScChange={(e) => {
							e.preventDefault();
							editItem({
								require_upfront_payment_method: scData
									?.entitlements
									?.optional_upfront_payment_method
									? !item?.require_upfront_payment_method
									: true,
							});
						}}
					>
						{__('Require Upfront Payment Method', 'surecart')}
						{!scData?.entitlements
							?.optional_upfront_payment_method && (
							<ScPremiumTag />
						)}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Whether or not a payment method should be required for subscriptions that have an initial period amount of $0 (free trial or coupon). This is useful if you want to offer a "no credit card required" free trials.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</ScUpgradeRequired>
				<ScSwitch
					checked={item?.bypass_duplicate_trials}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							bypass_duplicate_trials:
								!item?.bypass_duplicate_trials,
						});
					}}
				>
					{__('Prevent Duplicate Trials', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'When enabled, this setting prevents customers from receiving multiple trial periods for the same product. If a customer has previously used a trial for the product, they will be charged the full price instead of receiving another trial.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScFormControl label={true}>
						<span slot="label">
							{__('Purchase Revoke Behavior', 'surecart')}
							{!scData?.entitlements
								?.revoke_purchases_on_past_due && (
								<ScUpgradeRequired>
									<ScPremiumTag />
								</ScUpgradeRequired>
							)}
						</span>

						<ScSelect
							value={
								item?.revoke_purchases_on_past_due
									? 'true'
									: 'false'
							}
							unselect={false}
							onScChange={(e) =>
								editItem({
									revoke_purchases_on_past_due: !scData
										?.entitlements
										?.revoke_purchases_on_past_due
										? false
										: e.target.value === 'true',
								})
							}
							choices={[
								{
									value: 'true',
									label: __('Revoke Immediately', 'surecart'),
								},
								{
									value: 'false',
									label: __(
										'Revoke Purchase After All Payment Retries Fail',
										'surecart'
									),
								},
							]}
						/>
					</ScFormControl>
				</div>
			</SettingsBox>
			<SettingsBox
				title={__('Customer Portal', 'surecart')}
				description={__(
					'Manage what your customers are able to see and do from the customer portal.',
					'surecart'
				)}
				loading={!portalHasLoadedItem}
			>
				<ScSwitch
					checked={portalItem?.subscription_updates_enabled}
					onClick={(e) => {
						e.preventDefault();
						portalEditItem({
							subscription_updates_enabled:
								!portalItem?.subscription_updates_enabled,
						});
					}}
				>
					{__('Allow Subscription Changes', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Customers will be able to switch pricing plans from the customer portal. You can configure what happens when a subscription change happens from the Subscriptions settings page.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={portalItem?.subscription_quantity_updates_enabled}
					onClick={(e) => {
						e.preventDefault();
						portalEditItem({
							subscription_quantity_updates_enabled:
								!portalItem?.subscription_quantity_updates_enabled,
						});
					}}
				>
					{__('Allow Subscription Quantity Changes', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Customers will be able to change subscription quantities from the customer portal.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={portalItem?.subscription_cancellations_enabled}
					onClick={(e) => {
						e.preventDefault();
						portalEditItem({
							subscription_cancellations_enabled:
								!portalItem?.subscription_cancellations_enabled,
						});
					}}
				>
					{__('Allow Subscription Cancellations', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Customers will be able to cancel their subscriptions from the customer portal. You can configure what happens when a subscription cancellation happens from the Subscriptions settings page.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={item?.default_payment_method_detach_enabled}
					onScChange={(e) => {
						e.preventDefault();
						editItem({
							default_payment_method_detach_enabled:
								!item?.default_payment_method_detach_enabled,
						});
					}}
				>
					{__(
						'Allow Customers To Remove Default Payment Method',
						'surecart'
					)}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'When enabled, customers are allowed to remove their default payment method on file. This can lead to subscription payments failing since there is no payment method on file.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>
		</SettingsTemplate>
	);
};
