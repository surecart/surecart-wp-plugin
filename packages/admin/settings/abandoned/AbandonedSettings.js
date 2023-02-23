import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScInput,
	ScSelect,
	ScSwitch,
	ScTextarea,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../components/Error';
import useSave from '../UseSave';
import { useEntityProp } from '@wordpress/core-data';

import { TIME_CHOICES } from './util';
import Coupon from './Coupon';
import { useDispatch } from '@wordpress/data';
import { useEffect } from 'react';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { receiveEntityRecords } = useDispatch(coreStore);

	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'abandoned_checkout_protocol'
	);

	// recapcha.
	const [trackingConfirmation, setTrackingConfirmation] = useEntityProp(
		'root',
		'site',
		'surecart_tracking_confirmation'
	);

	const [trackingConfirmationMessage, setTrackingConfirmationMessage] =
		useEntityProp('root', 'site', 'surecart_tracking_confirmation_message');

	// update coupon in store.
	useEffect(() => {
		if (item?.coupon) {
			receiveEntityRecords('surecart', 'coupon', item.coupon);
		}
	}, [item?.coupon]);

	const updateNotification = (value, index) =>
		editItem({
			notification_delays: (item?.notification_delays || []).map(
				(item, i) => {
					if (i !== index) {
						// This isn't the item we care about - keep it as-is
						return item;
					}
					return parseInt(value);
				}
			),
		});

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
			title={__('Abandoned Checkout', 'surecart')}
			icon={<sc-icon name="shopping-cart"></sc-icon>}
			onSubmit={onSubmit}
			loading={!hasLoadedItem}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Notification Settings', 'surecart')}
				description={__(
					'Notification settings for abandoned checkouts',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.enabled}
					onScChange={(e) => editItem({ enabled: e.target.checked })}
				>
					{__('Enabled', 'surecart')}
					<span slot="description">
						{__(
							'Turn on abandoned cart for your store.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{item?.enabled && (
					<>
						<ScSelect
							label={__('First Email Delay', 'surecart')}
							value={item?.notification_delays?.[0]}
							onScChange={(e) =>
								updateNotification(e.target.value, 0)
							}
							choices={TIME_CHOICES}
						/>
						<ScSelect
							label={__('Second Email Delay', 'surecart')}
							value={item?.notification_delays?.[1]}
							onScChange={(e) =>
								updateNotification(e.target.value, 1)
							}
							choices={TIME_CHOICES}
						/>
						<ScSelect
							label={__('Final Email Delay', 'surecart')}
							value={item?.notification_delays?.[2]}
							onScChange={(e) =>
								updateNotification(e.target.value, 2)
							}
							choices={TIME_CHOICES}
						/>
					</>
				)}
			</SettingsBox>

			{item?.enabled && (
				<SettingsBox
					title={__('Discount Settings', 'surecart')}
					description={__(
						'Your discount settings for abandoned cart.',
						'surecart'
					)}
					loading={!hasLoadedItem}
				>
					<ScSwitch
						checked={item?.first_promotion_notification}
						onScChange={(e) =>
							editItem({
								first_promotion_notification: e.target.checked
									? 1
									: null,
							})
						}
					>
						{__('Abandoned Checkout Discount', 'surecart')}
						<span slot="description">
							{__(
								'Add a discount incentive for abandoned cart.',
								'surecart'
							)}
						</span>
					</ScSwitch>

					{!!item?.first_promotion_notification && (
						<>
							<Coupon coupon={item?.coupon} />
							<ScSelect
								label={__(
									'When should we offer the discount?',
									'surecart'
								)}
								value={item?.first_promotion_notification}
								onScChange={(e) => {
									if (e.target.value) {
										editItem({
											first_promotion_notification:
												parseInt(e.target.value),
										});
									}
								}}
								choices={[
									{
										label: __(
											'On the first email',
											'surecart'
										),
										value: 1,
									},
									{
										label: __(
											'On the second email',
											'surecart'
										),
										value: 2,
									},
									{
										label: __(
											'On the final email',
											'surecart'
										),
										value: 3,
									},
								]}
							/>
							<ScSwitch
								checked={!!item?.promotion_expires_after_days}
								onScChange={(e) =>
									editItem({
										promotion_expires_after_days: e.target
											.checked
											? 7
											: null,
									})
								}
							>
								{__('Discount Expires', 'surecart')}
							</ScSwitch>

							{!!item?.promotion_expires_after_days && (
								<ScInput
									type="number"
									min="1"
									required
									label={__(
										'Number of days until expiration',
										'surecart'
									)}
									value={item?.promotion_expires_after_days}
									onScInput={(e) => {
										if (e.target.value) {
											editItem({
												promotion_expires_after_days:
													e.target.value,
											});
										}
									}}
								>
									<span slot="suffix">
										{__('Days', 'surecart')}
									</span>
								</ScInput>
							)}
						</>
					)}
				</SettingsBox>
			)}

			<SettingsBox
				title={__('GDPR Settings', 'surecart')}
				description={__(
					'Data collection settings for GDPR.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={trackingConfirmation}
					onScChange={(e) =>
						setTrackingConfirmation(e.target.checked)
					}
				>
					{__('Tracking Confirmation', 'surecart')}
					<span slot="description">
						{__(
							'Note: By checking this, it will show confirmation text below the email on checkout forms.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!!trackingConfirmation && (
					<ScTextarea
						label={__('GDPR Message', 'surecart')}
						value={trackingConfirmationMessage}
						required
						onScInput={(e) =>
							setTrackingConfirmationMessage(e.target.value)
						}
					/>
				)}
			</SettingsBox>
			<SettingsBox
				title={__('Advanced Settings', 'surecart')}
				description={__(
					'Advanced settings for abandoned checkouts',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.ignore_purchased_products}
					onScChange={(e) =>
						editItem({
							ignore_purchased_products: e.target.checked ? 1 : 0,
						})
					}
				>
					{__('Ignore Purchased Products', 'surecart')}
					<span slot="description">
						{__(
							"Don't create abandoned checkout if all products in checkout have been purchased.",
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={!!item?.grace_period_days}
					onScChange={(e) =>
						editItem({
							grace_period_days: e.target.checked ? 1 : 0,
						})
					}
				>
					{__('Grace Period', 'surecart')}
					<span slot="description">
						{__(
							'Wait for a period of time after a customer has made a purchase to send other abandoned checkouts.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!!item?.grace_period_days && (
					<ScInput
						type="number"
						label={__('Grace Period', 'surecart')}
						showLabel={false}
						help={__(
							"The number of days to wait after a customer's purchase before allowing an abandoned checkout to be created. This helps to prevent abandoned checkouts being created for customers very soon after they have made a different purchase.",
							'surecart'
						)}
						value={item?.grace_period_days}
						onScInput={(e) => {
							if (e.target.value) {
								editItem({
									grace_period_days: e.target.value,
								});
							}
						}}
					>
						<span slot="suffix">{__('Days', 'surecart')}</span>
					</ScInput>
				)}
			</SettingsBox>
		</SettingsTemplate>
	);
};
