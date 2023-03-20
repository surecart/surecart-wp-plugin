/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { ScSelect, ScSwitch } from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';

export default () => {
	const [error, setError] = useState(null);
	const [menus, setMenus] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'settings'
	);
	const navMenuData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'nav_menu')
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

	useEffect(() => {
		if (navMenuData && navMenuData.length) {
			setMenus(navMenuData);
		}
	}, [navMenuData]);

	return (
		<SettingsTemplate
			title={__('Advanced Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Performance', 'surecart')}
				description={__(
					'Change your plugin performance settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.use_esm_loader}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							use_esm_loader: !item?.use_esm_loader,
						});
					}}
				>
					{__('Use JavaScript ESM Loader', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'This can slightly increase page load speed, but may require you to enable CORS headers for .js files on your CDN. Please check your checkout forms after you enable this option in a private browser window.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={!item?.slide_out_cart_disabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							slide_out_cart_disabled:
								!item?.slide_out_cart_disabled,
						});
					}}
				>
					{__('Enable Slide-Out Cart', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'If you do not wish to use the slide-out cart, you can disable this to prevent scripts from loading on your pages.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={item?.cart_menu_button_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							cart_menu_button_enabled:
								!item?.cart_menu_button_enabled,
						});
					}}
				>
					{__('Enable Menu Cart Button', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'If you wish to have a cart button in the navigation bar, you can enable this option.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			{item?.cart_menu_button_enabled && (
				<SettingsBox
					title={__('Menu Cart', 'surecart')}
					description={__(
						'Change menu cart button settings.',
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
						{menus && (
							<ScSelect
								label={__('Select Menu(s)', 'surecart')}
								placeholder={__('Select Menu', 'surecart')}
								value={item?.cart_menu_id}
								onScChange={(id) => {
									editItem({
										cart_menu_id: id,
									});
								}}
								help={__(
									'Select the menu(s) you wish to display the Menu Cart'
								)}
								choices={menus?.map((item) => ({
									label: `${item.name} : ${item.slug}`,
									value: item.id,
								}))}
							/>
						)}
						<ScSelect
							label={__('Alignment of cart button', 'surecart')}
							placeholder={__('Select Alignment', 'surecart')}
							value={item?.cart_menu_button_alignment}
							onScChange={(alignment) => {
								editItem({
									cart_menu_button_alignment: alignment,
								});
							}}
							unselect={false}
							help={__(
								'If your menu is right aligned, then placing the cart button to the right will look best.',
								'surecart'
							)}
							choices={[
								{
									label: __('Right Align', 'surecart'),
									value: 'right',
								},
								{
									label: __('Left Align', 'surecart'),
									value: 'left',
								},
							]}
						/>
					</div>
					<div
						css={css`
							gap: 2em;
							display: grid;
							align-items: flex-start;
							grid-template-columns: repeat(2, minmax(0, 1fr));
						`}
					>
						<ScSwitch
							checked={item?.cart_menu_button_always_shown}
							onClick={(e) => {
								e.preventDefault();
								editItem({
									cart_menu_button_always_shown:
										!item?.cart_menu_button_always_shown,
								});
							}}
						>
							{__('Always show cart', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									'Enable to always show the cart button, even your cart is empty.',
									'surecart'
								)}
							</span>
						</ScSwitch>
						<ScSwitch
							checked={item?.cart_flyout_menu_enabled}
							onClick={(e) => {
								e.preventDefault();
								editItem({
									cart_flyout_menu_enabled:
										!item?.cart_flyout_menu_enabled,
								});
							}}
						>
							{__('Menu Fly-out', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									"Disable if you don't wish to show cart contents in menu fly-out.",
									'surecart'
								)}
							</span>
						</ScSwitch>
					</div>
				</SettingsBox>
			)}

			<SettingsBox
				title={__('Beta Features', 'surecart')}
				description={__(
					'Opt-in to some beta features of the plugin.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.stripe_payment_element}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							stripe_payment_element:
								!item?.stripe_payment_element,
						});
					}}
				>
					{__('Use the Stripe Payment Element', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							"Use Stripe's Payment Element instead of the Card Element in all forms.",
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Uninstall', 'surecart')}
				description={__(
					'Change your plugin uninstall settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.uninstall}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							uninstall: !item?.uninstall,
						});
					}}
				>
					{__('Remove Plugin Data', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Completely remove all plugin data when deleted. This cannot be undone.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>
		</SettingsTemplate>
	);
};
