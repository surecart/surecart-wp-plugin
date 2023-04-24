/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScPremiumTag,
	ScSelect,
	ScSwitch,
	ScUpgradeRequired,
	ScFormControl,
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
				error={itemError || error}
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
				title={__('Behavior', 'surecart')}
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
		</SettingsTemplate>
	);
};
