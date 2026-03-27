/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import {
	ScSwitch,
	ScUpgradeRequired,
	ScPremiumTag,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import { __ } from '@wordpress/i18n';
import Error from '../../components/Error';
import useSave from '../UseSave';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import useEntity from '../../hooks/useEntity';
import CartSettings from './components/CartSettings';
import ThemeModeCard from './components/ThemeModeCard';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	const { editEntityRecord } = useDispatch(coreStore);

	/** Edit Item */
	const editItem = (data) =>
		editEntityRecord('surecart', 'store', 'brand', data);

	/** Load Item */
	const { item, itemError, hasLoadedItem } = useSelect((select) => {
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

	const {
		item: settingItem,
		itemError: settingItemError,
		editItem: editSettingItem,
		hasLoadedItem: hasLoadedSettingItem,
	} = useEntity('store', 'settings');

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

	const activeTheme = item?.theme || 'light';

	return (
		<SettingsTemplate
			title={__('Design & Branding', 'surecart')}
			icon={<sc-icon name="pen-tool"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || settingItemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Brand Settings', 'surecart')}
				description={__(
					'Customize how your brand appears globally across SureCart. Your logo and colors will be used on hosted pages and emails that are sent to your customers.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				{/* Theme heading */}
				<div
					css={css`
						margin-bottom: 0.25em;
					`}
				>
					<span
						css={css`
							font-weight: 600;
							font-size: 14px;
						`}
					>
						{__('Theme', 'surecart')}
					</span>
					<p
						css={css`
							margin: 0.25em 0 0;
							font-size: 13px;
							color: var(--sc-color-gray-500, #6b7280);
						`}
					>
						{__(
							'This applies to your WordPress site, emails and affiliate portal.',
							'surecart'
						)}
					</p>
				</div>

				{/* Two mode cards side by side */}
				<div
					css={css`
						display: grid;
						gap: 1.5em;
						grid-template-columns: repeat(2, minmax(0, 1fr));
						@media (max-width: 768px) {
							grid-template-columns: 1fr;
						}
					`}
				>
					<ThemeModeCard
						mode="light"
						isActive={activeTheme === 'light'}
						brand={item}
						editBrand={editItem}
						colorKey="color"
						logoKey="logo"
					/>
					<ThemeModeCard
						mode="dark"
						isActive={activeTheme === 'dark'}
						brand={item}
						editBrand={editItem}
						colorKey="dark_color"
						logoKey="dark_logo"
					/>
				</div>

				<ScUpgradeRequired
					required={
						!scData?.entitlements?.optional_upfront_payment_method
					}
				>
					<ScSwitch
						checked={
							scData?.entitlements?.optional_powered_by
								? !item?.powered_by_enabled
								: false
						}
						onScChange={(e) =>
							editItem({
								powered_by_enabled: scData?.entitlements
									?.optional_powered_by
									? !e.target.checked
									: true,
							})
						}
					>
						{__('Remove SureCart Branding', 'surecart')}{' '}
						{!scData?.entitlements?.optional_powered_by && (
							<ScPremiumTag />
						)}
						<span slot="description">
							{__(
								'Remove "Powered By SureCart" in the footer of emails and receipts/invoices.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</ScUpgradeRequired>
			</SettingsBox>

			<SettingsBox
				title={__('Cart', 'surecart')}
				loading={!hasLoadedSettingItem}
				description={__('Change cart settings.', 'surecart')}
			>
				<ScSwitch
					checked={!settingItem?.slide_out_cart_disabled}
					onClick={(e) => {
						e.preventDefault();
						editSettingItem({
							slide_out_cart_disabled:
								!settingItem?.slide_out_cart_disabled,
						});
					}}
				>
					{__('Enable Cart', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'This will enable slide-out cart. If you do not wish to use the cart, you can disable this to prevent cart scripts from loading on your pages.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!settingItem?.slide_out_cart_disabled && <CartSettings />}
			</SettingsBox>
		</SettingsTemplate>
	);
};
