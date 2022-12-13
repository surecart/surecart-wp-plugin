import { css, jsx } from '@emotion/core';
import { ScInput, ScStackedList, ScSwitch, ScTag } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/** @jsx jsx */
import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import EmailRow from './EmailRow';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'customer_notification_protocol'
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

	return (
		<SettingsTemplate
			title={__('Notifications', 'surecart')}
			icon={<sc-icon name="bell"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Notification Settings', 'surecart')}
				description={__(
					"Use these settings to configure how notifications are sent to your customers. Currently, all emails are sent from notifications@surecart.com, but in the future you'll be able to set your own email server if you'd like.",
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
					<ScInput
						label={__('Sender Name', 'surecart')}
						placeholder={__('Enter the sender name', 'surecart')}
						value={item?.from_name}
						onScInput={(e) =>
							editItem({ from_name: e.target.value })
						}
					/>
					<ScInput
						label={__('Reply To Email', 'surecart')}
						placeholder={__(
							'notifications@surecart.com',
							'surecart'
						)}
						value={item?.reply_to_email}
						onScInput={(e) =>
							editItem({ reply_to_email: e.target.value })
						}
						type="tel"
					/>
				</div>
			</SettingsBox>

			<SettingsBox
				title={__('Notifications', 'surecart')}
				description={__(
					'Manage which notifications are sent to your customers.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.order_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							order_enabled: !item?.order_enabled,
						});
					}}
				>
					{__('Order Confirmation Emails', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Send a general order confirmation email to your customers when an order is paid. These emails include a breakdown of the order, and a link to a page where they can download their invoice and receipt.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={item?.refund_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							refund_enabled: !item?.refund_enabled,
						});
					}}
				>
					{__('Refund Emails', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Send a quick reminder when a refund is created for a customer. These emails contain the amount and payment method being refunded.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={item?.subscription_renewal_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							subscription_renewal_enabled:
								!item?.subscription_renewal_enabled,
						});
					}}
				>
					{__('Subscription Renewal Emails', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Send an email customers when their subscription renews.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={item?.subscription_cancellation_enabled}
					onScChange={(e) => {
						e.preventDefault();
						editItem({
							subscription_cancellation_enabled:
								!item?.subscription_cancellation_enabled,
						});
					}}
				>
					{__('Subscription Cancellation Notification', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Send a general subscription cancellation confirmation email to your customers when subscription canceled.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={item?.subscription_reminder_enabled}
					onScChange={(e) => {
						e.preventDefault();
						editItem({
							subscription_reminder_enabled:
								!item?.subscription_reminder_enabled,
						});
					}}
					css={css`
						::part(base) {
							opacity: 1;
						}
					`}
				>
					{__('Subscription Reminder Notifications', 'surecart')}{' '}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Send a reminder to your subscribers 3 days before their subscription renews.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={
						scData?.entitlements?.payment_failure_notifications
							? item?.payment_failure_enabled
							: false
					}
					disabled={
						!scData?.entitlements?.payment_failure_notifications
					}
					onScChange={(e) => {
						e.preventDefault();
						editItem({
							payment_failure_enabled:
								!item?.payment_failure_enabled,
						});
					}}
					css={css`
						::part(base) {
							opacity: 1;
						}
					`}
				>
					{__('Subscription Recovery Emails', 'surecart')}{' '}
					{!scData?.entitlements?.payment_failure_notifications && (
						<ScTag type="success" size="small" pill>
							{__('Pro', 'surecart')}
						</ScTag>
					)}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							"Subscription payments fail all the time. Don't leave your recurring revenue to chance - turn on recovery emails to increase your chances of recovering subscriptions with failed payments.",
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Customer Emails', 'surecart')}
				description={__(
					'Customize the content of each notification that is sent to your customers.',
					'surecart'
				)}
				noButton
				loading={!hasLoadedItem}
				wrapperTag={'div'}
			>
				<sc-card no-padding>
					<ScStackedList>
						<EmailRow
							title={__('Abandoned Checkout #1', 'surecart')}
							description={__(
								'First email sent when a checkout is abandoned.',
								'surecart'
							)}
							disabled={
								!scData?.entitlements?.abandoned_checkouts
							}
							model="abandoned_checkout"
							action="notification1"
						/>
						<EmailRow
							title={__('Abandoned Checkout #2', 'surecart')}
							description={__(
								'Second email sent when a checkout is abandoned.',
								'surecart'
							)}
							disabled={
								!scData?.entitlements?.abandoned_checkouts
							}
							model="abandoned_checkout"
							action="notification2"
						/>
						<EmailRow
							title={__('Abandoned Checkout #3', 'surecart')}
							description={__(
								'Third (final) email sent when a checkout is abandoned.',
								'surecart'
							)}
							disabled={
								!scData?.entitlements?.abandoned_checkouts
							}
							model="abandoned_checkout"
							action="notification3"
						/>
						<EmailRow
							title={__('Magic Sign In', 'surecart')}
							description={__(
								'Sent to customers to login to the customer portal without a password.',
								'surecart'
							)}
							model="customer_link"
						/>
						<EmailRow
							title={__('Order Confirmation', 'surecart')}
							description={__(
								'Sent to customers after they place an order.',
								'surecart'
							)}
							model="order"
						/>
						<EmailRow
							title={__('Subscription Recovery', 'surecart')}
							description={__(
								"Sent to customers when their subscription's payment method fails.",
								'surecart'
							)}
							disabled={
								!scData?.entitlements
									?.payment_failure_notifications
							}
							model="payment_failure"
						/>
						<EmailRow
							title={__('Subscription Reminder', 'surecart')}
							description={__(
								'Sent to customers 3 days before a subscription renews.',
								'surecart'
							)}
							model="subscription"
							action="reminder_notification"
						/>
						<EmailRow
							title={__('Subscription Renewal', 'surecart')}
							description={__(
								'Sent to customers when their subscription renews.',
								'surecart'
							)}
							model="subscription"
							action="renewal_notification"
						/>
						<EmailRow
							title={__('Subscription Cancellation', 'surecart')}
							description={__(
								'Sent to customers when their subscription cancellation.',
								'surecart'
							)}
							model="subscription"
							action="cancellation_notification"
						/>
						<EmailRow
							title={__('Product Access', 'surecart')}
							description={__(
								'Sent to customers when a purchase is downloadable or has a license.',
								'surecart'
							)}
							model="purchase"
						/>
						<EmailRow
							title={__('Refund', 'surecart')}
							description={__(
								'Sent to customers when a charge is refunded.',
								'surecart'
							)}
							model="refund"
						/>
					</ScStackedList>
				</sc-card>
			</SettingsBox>

			<SettingsBox
				title={__('Store Emails', 'surecart')}
				description={__(
					'These are the emails that are sent to you and other team members of this store.',
					'surecart'
				)}
				noButton
				loading={!hasLoadedItem}
				wrapperTag={'div'}
			>
				<sc-card no-padding>
					<ScStackedList>
						<EmailRow
							title={__('New Order', 'surecart')}
							description={__(
								'Sent when an order is created.',
								'surecart'
							)}
							link="account_notifications"
							model="order"
							action="notification"
						/>
						<EmailRow
							title={__('Subscription Cancellation', 'surecart')}
							description={__(
								'Sent when a subscription is canceled.',
								'surecart'
							)}
							link="account_notifications"
							model="subscription"
							action="cancellation_notification"
						/>
						<EmailRow
							title={__('Subscription Payment', 'surecart')}
							description={__(
								'Sent when a subscription renews.',
								'surecart'
							)}
							link="account_notifications"
							model="subscription"
							action="renewal_notification"
						/>
						<EmailRow
							title={__(
								'Subscription Payment Failure',
								'surecart'
							)}
							description={__(
								'Sent when a subscription payment fails.',
								'surecart'
							)}
							link="account_notifications"
							model="subscription"
							action="payment_failure_notification"
						/>
					</ScStackedList>
				</sc-card>
			</SettingsBox>
		</SettingsTemplate>
	);
};
