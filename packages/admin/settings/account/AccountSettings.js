/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScInput,
	ScSelect,
	ScAddress,
	ScIcon,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { getCurrencySymbol } from '../../util';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { editEntityRecord } = useDispatch(coreStore);
	const {
		item: accountItem,
		itemError: accountItemError,
		editItem: editAccountItem,
		hasLoadedItem: hasLoadedAccountItem,
	} = useEntity('store', 'account');
	const { hasLiveOrders } = useSelect((select) => {
		const liveOrderCount =
			select(coreStore).getEntityRecords('surecart', 'order', {
				status: 'live',
				per_page: 1,
			})?.length || 0;

		return {
			hasLiveOrders: liveOrderCount > 0,
		};
	});

	const {
		item: portalItem,
		itemError: portalItemError,
		editItem: portalEditItem,
		hasLoadedItem: portalHasLoadedItem,
	} = useEntity('store', 'portal_protocol');
	const {
		item: notificationItem,
		itemError: notificationItemError,
		editItem: notificationEditItem,
		hasLoadedItem: notificationHasLoadedItem,
	} = useEntity('store', 'customer_notification_protocol');
	/** Edit Item */
	const brandEditItem = (data) =>
		editEntityRecord('surecart', 'store', 'brand', data);

	/** Load Item */
	const {
		item: brandItem,
		itemError: brandItemError,
		hasLoadedItem: brandHasLoadedItem,
	} = useSelect((select) => {
		const entityData = ['surecart', 'store', 'brand'];
		return {
			item: select(coreStore).getEditedEntityRecord(...entityData),
			itemError: select(coreStore)?.getResolutionError?.(
				'getEditedEntityRecord',
				...entityData
			),
			hasLoadedItem: select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...entityData]
			),
		};
	});

	const supportedCurrencyOptions = Object.keys(
		scData?.supported_currencies || {}
	).map((value) => {
		return {
			label: `${scData?.supported_currencies[value]} (${getCurrencySymbol(
				value
			)})`,
			value,
		};
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
			title={__('Store Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
			loading={!hasLoadedAccountItem || !portalHasLoadedItem}
		>
			<Error
				error={
					accountItemError ||
					portalItemError ||
					brandItemError ||
					notificationItemError ||
					error
				}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Store Details', 'surecart')}
				description={__(
					'The name of your store will be visible to customers, so you should use a name that is recognizable and identifies your store to your customers.',
					'surecart'
				)}
				loading={!hasLoadedAccountItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScInput
						value={accountItem?.name}
						label={__('Store Name', 'surecart')}
						placeholder={__('Store Name', 'surecart')}
						onScInput={(e) =>
							editAccountItem({ name: e.target.value })
						}
						help={__(
							'This is displayed in the UI and in notifications.',
							'surecart'
						)}
						required
					></ScInput>

					<ScInput
						value={accountItem?.url}
						label={__('Store URL', 'surecart')}
						placeholder={__('https://example.com', 'surecart')}
						onScInput={(e) =>
							editAccountItem({ url: e.target.value })
						}
						help={__(
							'This should be your live storefront URL.',
							'surecart'
						)}
						type="url"
					></ScInput>

					<div
						css={css`
							grid-column: 1 / 3;
						`}
					>
						<ScSelect
							search
							value={accountItem?.currency}
							onScChange={(e) =>
								editAccountItem({ currency: e.target.value })
							}
							choices={supportedCurrencyOptions}
							label={__('Default Currency', 'surecart')}
							required
							disabled={hasLiveOrders}
							{...(hasLiveOrders
								? {}
								: {
										help: __(
											'The default currency for new products.',
											'surecart'
										),
								  })}
						/>
						{hasLiveOrders && (
							<div
								css={css`
									padding: var(--sc-spacing-small);
									margin: 0;
									margin-top: var(--sc-spacing-small);
									background: var(
										--sc-color-brand-main-background
									);
									border-bottom: 1px solid
										var(--sc-color-brand-stroke);
									display: flex;
									align-items: center;
									gap: var(--sc-spacing-small);
									border-radius: var(
										--sc-border-radius-small
									);
								`}
							>
								<ScIcon name="alert-circle" />
								<div>
									{__(
										'This option is locked after the first live order. To change currency, please',
										'surecart'
									)}{' '}
									<a
										href="https://surecart.com/support/"
										target="_blank"
										rel="noreferrer"
									>
										{__('contact support.', 'surecart')}
									</a>
								</div>
							</div>
						)}
					</div>

					<ScSelect
						search
						value={accountItem?.time_zone}
						onScChange={(e) =>
							editAccountItem({ time_zone: e.target.value })
						}
						choices={Object.keys(scData?.time_zones || {}).map(
							(value) => {
								const label = scData?.time_zones[value];
								return {
									label,
									value,
								};
							}
						)}
						label={__('Time Zone', 'surecart')}
						help={__(
							'Change this if you want the store to be in a different time zone than your server.',
							'surecart'
						)}
						required
					/>

					<ScSelect
						value={accountItem?.locale}
						onScChange={(e) =>
							editAccountItem({ locale: e.target.value })
						}
						choices={[
							{
								value: 'en',
								label: 'English - United States',
							},
							{
								value: 'bg',
								label: 'български (Bŭlgarski)',
							},
							{
								value: 'de',
								label: 'Deutsch',
							},
							{
								value: 'es',
								label: 'Español',
							},
							{
								value: 'fr',
								label: 'Français',
							},
							{
								value: 'it',
								label: 'Italiano',
							},
							{
								value: 'ja',
								label: '日本 (Nihon)',
							},
							{
								value: 'nl',
								label: 'Nederland',
							},
							{
								value: 'pl',
								label: 'Polski',
							},
							{
								value: 'pt',
								label: 'Português',
							},
							{
								value: 'pt_br',
								label: 'Português - Brasil',
							},
						]}
						label={__('Store Language', 'surecart')}
						help={__(
							'The language used for notifications, invoices, etc.',
							'surecart'
						)}
						required
					/>

					<ScInput
						label={__('Terms Page', 'surecart')}
						type="url"
						value={portalItem?.terms_url}
						onScInput={(e) => {
							portalEditItem({
								terms_url: e.target.value || null,
							});
						}}
						help={__(
							'A link to your store terms page.',
							'surecart'
						)}
					/>
					<ScInput
						label={__('Privacy Policy Page', 'surecart')}
						type="url"
						value={portalItem?.privacy_url}
						onScInput={(e) => {
							portalEditItem({
								privacy_url: e.target.value || null,
							});
						}}
						help={__(
							'A link to your privacy policy page.',
							'surecart'
						)}
					/>
				</div>
			</SettingsBox>

			<SettingsBox
				title={__('Notification Settings', 'surecart')}
				description={__(
					'Use these settings to configure how notifications are sent to your customers.',
					'surecart'
				)}
				loading={!notificationHasLoadedItem}
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
						value={notificationItem.from_name}
						onScInput={(e) =>
							notificationEditItem({ from_name: e.target.value })
						}
					/>
					<ScInput
						label={__('Reply To Email', 'surecart')}
						placeholder={__(
							'notifications@surecart.com',
							'surecart'
						)}
						value={notificationItem.reply_to_email}
						onScInput={(e) =>
							notificationEditItem({
								reply_to_email: e.target.value,
							})
						}
						type="tel"
					/>
				</div>
			</SettingsBox>
			<SettingsBox
				title={__('Contact Information', 'surecart')}
				description={__(
					'This information helps customers recognize your business and contact you when necessary. It will be visible on invoices/receipts and any emails that need to be CAN-SPAM compliant (i.e. abandoned order emails).',
					'surecart'
				)}
				loading={!brandHasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(3, minmax(0, 1fr));
					`}
				>
					<ScInput
						label={__('Email', 'surecart')}
						value={brandItem.email}
						placeholder={__('Enter an email', 'surecart')}
						onScInput={(e) =>
							brandEditItem({ email: e.target.value })
						}
						type="email"
					/>
					<ScInput
						label={__('Phone', 'surecart')}
						value={brandItem.phone}
						placeholder={__('Enter an phone number', 'surecart')}
						onScInput={(e) =>
							brandEditItem({ phone: e.target.value })
						}
						type="tel"
					/>
					<ScInput
						label={__('Website', 'surecart')}
						value={brandItem.website}
						placeholder={__('Enter a website URL', 'surecart')}
						onScInput={(e) =>
							brandEditItem({ website: e.target.value })
						}
						type="url"
					/>
				</div>

				<ScAddress
					label={__('Address', 'surecart')}
					required={false}
					showName={true}
					showLine2={true}
					address={brandItem.address}
					names={{}}
					onScInputAddress={(e) =>
						brandEditItem({ address: e.detail })
					}
				/>
			</SettingsBox>
		</SettingsTemplate>
	);
};
