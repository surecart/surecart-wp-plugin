/** @jsx jsx */
import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import EmailRow from './EmailRow';
import { css, jsx } from '@emotion/core';
import {
	ScInput,
	ScStackedList,
	ScSwitch,
	ScTag,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
			title={__('Customer Notifications', 'surecart')}
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
					checked={
						scData?.entitlements?.abandoned_checkouts
							? item?.abandoned_checkout_enabled
							: false
					}
					disabled={!scData?.entitlements?.abandoned_checkouts}
					onScChange={(e) => {
						e.preventDefault();
						editItem({
							abandoned_checkout_enabled:
								!item?.abandoned_checkout_enabled,
						});
					}}
					css={css`
						::part(base) {
							opacity: 1;
						}
					`}
				>
					{__('Abandoned Checkout Emails', 'surecart')}{' '}
					{!scData?.entitlements?.abandoned_checkouts && (
						<ScTag type="success" size="small" pill>
							{__('Pro', 'surecart')}
						</ScTag>
					)}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Turn on abandoned order emails to remind your customers of incomplete orders. Abandoned order emails are sent 4 hours after abandonment. If the order is still abandoned after 24 hours another email will be sent.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={
						scData?.entitlements
							?.subscription_reminder_notifications
							? item?.subscription_reminder_enabled
							: false
					}
					disabled={
						!scData?.entitlements
							?.subscription_reminder_notifications
					}
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
					{!scData?.entitlements
						?.subscription_reminder_notifications && (
						<ScTag type="success" size="small" pill>
							{__('Pro', 'surecart')}
						</ScTag>
					)}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Send an reminding your subscribers that their reorders are coming up.',
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
				title={__('Customize Notification Emails', 'surecart')}
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
							title={__('Subscription Dunning', 'surecart')}
							description={__(
								"Sent to customers when their subscription's payment method fails.",
								'surecart'
							)}
							model="payment_failure"
						/>
						<EmailRow
							title={__('Download Verification', 'surecart')}
							description={__(
								'Sent to customers to verify their email address before downloading files.',
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
		</SettingsTemplate>
	);
};
