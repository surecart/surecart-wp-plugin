/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScSwitch,
	ScInput,
	ScAlert,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import CustomerSyncModal from './components/CustomerSyncModal';
import { useEntityProp } from '@wordpress/core-data';
import ProductSyncButton from './components/ProductSyncButton';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'settings'
	);
	const [modal, setModal] = useState(null);

	const [showNotice, setShowNotice] = useState(false);

	// honeypot.
	const [honeypotEnabled, setHoneypotEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_honeypot_enabled'
	);
	// recapcha.
	const [recaptchaEnabled, setRecaptchaEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_recaptcha_enabled'
	);
	const [recaptchaSiteKey, setRecaptchaSiteKey] = useEntityProp(
		'root',
		'site',
		'surecart_recaptcha_site_key'
	);
	const [recaptchaSecretKey, setRecapchaSecretKey] = useEntityProp(
		'root',
		'site',
		'surecart_recaptcha_secret_key'
	);
	// enable stripe script.
	const [stripeScriptEnabled, setStripeScriptEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_load_stripe_js'
	);
	// password validation.
	const [passwordValidation, setPasswordValidation] = useEntityProp(
		'root',
		'site',
		'surecart_password_validation_enabled'
	);

	const [shopMenu, setShopMenu] = useEntityProp(
		'root',
		'site',
		'surecart_shop_admin_menu'
	);

	const [cartMenu, setCartMenu] = useEntityProp(
		'root',
		'site',
		'surecart_cart_admin_menu'
	);
	const [checkoutMenu, setCheckoutMenu] = useEntityProp(
		'root',
		'site',
		'surecart_checkout_admin_menu'
	);
	const [customerMenu, setCustomerMenu] = useEntityProp(
		'root',
		'site',
		'surecart_dashboard_admin_menu'
	);
	const [unrestrictedTestMode, setUnrestrictedTestMode] = useEntityProp(
		'root',
		'site',
		'surecart_unrestricted_test_mode'
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
				{!scData?.is_block_theme && (
					<ScSwitch
						checked={item?.load_block_assets_on_demand}
						onClick={(e) => {
							e.preventDefault();
							editItem({
								load_block_assets_on_demand:
									!item?.load_block_assets_on_demand,
							});
						}}
					>
						{__('On Demand Block Assets', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Enabling this option will load block assets only when they are rendered. This will happen for ALL blocks on your website, not just SureCart blocks. Please check your pages after you enable this option in a private browser window as this might change the CSS load order.',
								'surecart'
							)}
							<div
								style={{
									fontStyle: 'italic',
									marginTop: '0.5em',
								}}
							>
								{__(
									"Note: This option is sometimes enabled by the theme. If it is already enabled by the theme, then this setting won't have any effect.",
									'surecart'
								)}
							</div>
						</span>
					</ScSwitch>
				)}
			</SettingsBox>

			<SettingsBox
				title={__('Spam Protection & Security', 'surecart')}
				description={__(
					'Change your checkout spam protection and security settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={!unrestrictedTestMode}
					onScChange={(e) =>
						setUnrestrictedTestMode(!e.target.checked)
					}
				>
					{__('Test Mode Restricted', 'surecart')}
					<span slot="description">
						{__(
							'Restrict test orders to store administrators only. Disable this setting to allow anyone to complete test orders.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={honeypotEnabled}
					onScChange={(e) => setHoneypotEnabled(e.target.checked)}
				>
					{__('Honeypot', 'surecart')}
					<span slot="description">
						{__(
							'This adds a field that is invisible to users, but visible to bots in an attempt to trick them into filling it out.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={recaptchaEnabled}
					onScChange={(e) => {
						setRecaptchaEnabled(e.target.checked);
						setShowNotice(true);
					}}
				>
					{__('Recaptcha v3', 'surecart')}
					<span slot="description">
						{__(
							'Enable Recaptcha spam protection on checkout forms.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{showNotice && recaptchaSiteKey && (
					<ScAlert open>
						<span slot="title">{__('Important', 'surecart')}</span>
						{__(
							'Please clear checkout page cache after changing this setting.',
							'surecart'
						)}
					</ScAlert>
				)}

				{recaptchaEnabled && (
					<>
						<div
							css={css`
								gap: var(--sc-form-row-spacing);
								display: grid;
								grid-template-columns: repeat(
									2,
									minmax(0, 1fr)
								);
							`}
						>
							<ScInput
								value={recaptchaSiteKey}
								label={__('reCaptcha Site Key', 'surecart')}
								placeholder={__(
									'reCaptcha Site Key',
									'surecart'
								)}
								onScInput={(e) =>
									setRecaptchaSiteKey(e.target.value)
								}
								type="password"
								help={__(
									'You can find this on your google Recaptcha dashboard.',
									'surecart'
								)}
							></ScInput>
							<ScInput
								value={recaptchaSecretKey}
								label={__('reCaptcha Secret Key', 'surecart')}
								placeholder={__(
									'reCaptcha Secret Key',
									'surecart'
								)}
								onScInput={(e) =>
									setRecapchaSecretKey(e.target.value)
								}
								type="password"
								help={__(
									'You can find this on your google Recaptcha dashboard.',
									'surecart'
								)}
							></ScInput>
						</div>
						{!recaptchaSiteKey && (
							<ScAlert open>
								{__('To get your Recaptcha keys', 'surecart')}{' '}
								<a
									href="https://www.google.com/recaptcha/admin/create"
									target="_blank"
								>
									{__(
										'register a new site and choose v3.',
										'surecart'
									)}
								</a>
							</ScAlert>
						)}
					</>
				)}
				{Array.isArray(scData.processors) &&
					scData.processors.some(
						(processor) => processor.processor_type === 'stripe'
					) && (
						<ScSwitch
							checked={stripeScriptEnabled}
							onScChange={(e) =>
								setStripeScriptEnabled(e.target.checked)
							}
						>
							{__('Stripe Fraud Monitoring', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									'This will load stripe.js on every page to help with Fraud monitoring.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					)}
				<ScSwitch
					checked={passwordValidation}
					onScChange={(e) => setPasswordValidation(e.target.checked)}
				>
					{__('Strong Password Validation', 'surecart')}
					<span slot="description">
						{__(
							'This ensures all the password fields have a stronger validation for user password input i.e. at least 6 characters and one special character.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Admin Appearance', 'surecart')}
				description={__('Change some admin UI options.', 'surecart')}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={shopMenu}
					onScChange={(e) => setShopMenu(e.target.checked)}
				>
					{__('Shop Page', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Show a link to edit the shop page in the menu.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={cartMenu}
					onScChange={(e) => setCartMenu(e.target.checked)}
				>
					{__('Cart Page', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Show a link to edit the cart in the menu.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={checkoutMenu}
					onScChange={(e) => setCheckoutMenu(e.target.checked)}
				>
					{__('Checkout Page', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Show a link to edit the checkout page in the menu.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={customerMenu}
					onScChange={(e) => setCustomerMenu(e.target.checked)}
				>
					{__('Customer Area', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Show a link to edit the customer area in the menu.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Legacy Features', 'surecart')}
				description={__(
					'Opt-in to some legacy features of the plugin.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.stripe_payment_element === false}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							stripe_payment_element:
								!item?.stripe_payment_element,
						});
					}}
				>
					{__('Use The Stripe Card Element', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							"Use Stripe's Card Element instead of the Payment Element in all forms.",
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Syncing', 'surecart')}
				description={__(
					'Manually sync your WordPress install with SureCart.',
					'surecart'
				)}
				noButton
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						display: flex;
						gap: 1em;
						justify-content: space-between;
						--sc-input-label-margin: 0;
					`}
				>
					<ScFormControl
						label={__('Customers', 'surecart')}
						help={__(
							'Create WordPress users for all SureCart customers that don’t already have one. This is helpful if you’ve migrated from another eCommerce platform.',
							'surecart'
						)}
					/>
					<div>
						<ScButton onClick={() => setModal('customer-sync')}>
							<ScIcon name="refresh-ccw" slot="prefix"></ScIcon>
							{__('Sync', 'surecart')}
						</ScButton>
					</div>
				</div>
				<div
					css={css`
						display: flex;
						gap: 1em;
						justify-content: space-between;
						--sc-input-label-margin: 0;
					`}
				>
					<ScFormControl
						label={__('Products', 'surecart')}
						help={__(
							'Run a sync on all SureCart products to post types.',
							'surecart'
						)}
					/>
					<div>
						<ProductSyncButton />
					</div>
				</div>
			</SettingsBox>

			<SettingsBox
				title={__('Clear Test Data', 'surecart')}
				description={__(
					'Clear out all of your test data with one-click.',
					'surecart'
				)}
				loading={!hasLoadedItem}
				noButton={true}
			>
				<ScButton
					type="danger"
					href={`https://app.surecart.com/account/edit?switch_account_id=${scData?.account_id}`}
					target="_blank"
					outline
				>
					{__('Clear Test Data', 'surecart')}
					<ScIcon name="external-link" slot="suffix" />
				</ScButton>
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

			<CustomerSyncModal
				open={modal === 'customer-sync'}
				onRequestClose={() => setModal(null)}
			/>
		</SettingsTemplate>
	);
};
