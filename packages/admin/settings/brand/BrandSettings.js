/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import {
	ScFormControl,
	ScInput,
	ScSelect,
	ScSwitch,
	ScUpgradeRequired,
	ScPremiumTag,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import { __ } from '@wordpress/i18n';
import ColorPopup from '../../../blocks/components/ColorPopup';
import Error from '../../components/Error';
import useSave from '../UseSave';
import Logo from './Logo';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import useEntity from '../../hooks/useEntity';
import CartSettings from './components/CartSettings';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	const { editEntityRecord } = useDispatch(coreStore);

	const [scThemeData, setScThemeData] = useEntityProp(
		'root',
		'site',
		'surecart_theme'
	);

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
				<div
					css={css`
						gap: 2em;
						display: grid;
						align-items: flex-start;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScFormControl
						label={__('Brand Color', 'surecart')}
						help={__(
							'This color will be used for the main button color, links, and various UI elements.',
							'surecart'
						)}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<ColorPopup
								color={`#${item?.color}`}
								setColor={(color) => {
									editItem({
										color: color?.hex.replace('#', ''),
									});
								}}
							/>
							<ScInput
								css={css`
									flex: 1;
								`}
								value={item?.color}
								onScInput={(e) =>
									editItem({
										color: e.target.value.replace('#', ''),
									})
								}
							>
								<div slot="prefix" style={{ opacity: '0.5' }}>
									#
								</div>
							</ScInput>
						</div>
					</ScFormControl>
					<Logo
						label={__('Logo', 'surecart')}
						brand={item}
						editBrand={editItem}
					/>
				</div>
				<div
					css={css`
						gap: 2em;
						display: grid;
					`}
				>
					<ScSelect
						label={__('Select Theme (Beta)', 'surecart')}
						placeholder={__('Select Theme', 'surecart')}
						value={scThemeData}
						onScChange={(e) => setScThemeData(e.target.value)}
						help={__(
							'Choose "Dark" if your theme already has a dark background.',
							'surecart'
						)}
						unselect={false}
						choices={[
							{
								label: __('Light', 'surecart'),
								value: 'light',
							},
							{
								label: __('Dark', 'surecart'),
								value: 'dark',
							},
						]}
					/>
					<ScUpgradeRequired
						required={
							!scData?.entitlements
								?.optional_upfront_payment_method
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
									'Remove "Powered By SureCart" in the footer of emails and reciepts/invoices.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					</ScUpgradeRequired>
				</div>
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

			<SettingsBox
				title={__('Admin Toolbar', 'surecart')}
				loading={!hasLoadedSettingItem}
				description={__('Change admin toolbar settings.', 'surecart')}
			>
				<ScSwitch
					checked={!settingItem?.admin_toolbar_disabled}
					onClick={(e) => {
						e.preventDefault();
						editSettingItem({
							admin_toolbar_disabled:
								!settingItem?.admin_toolbar_disabled,
						});
					}}
				>
					{__('Enable Admin Toolbar', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'This will enable the SureCart admin toolbar in the WordPress admin bar for easy access to SureCart features.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>
		</SettingsTemplate>
	);
};
