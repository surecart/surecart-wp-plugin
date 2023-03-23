/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScAlert,
	ScInput,
	ScSelect,
	ScSwitch,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import { useEntityProp } from '@wordpress/core-data';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const [showNotice, setShowNotice] = useState(false);
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'account'
	);

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

	/**
	 * Get the symbol for the currency.
	 */
	const getCurrencySymbol = (code) => {
		const [currency] = new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: code,
		}).formatToParts();
		return currency?.value;
	};

	return (
		<SettingsTemplate
			title={__('Store Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
			loading={!hasLoadedItem}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Store Details', 'surecart')}
				description={__(
					'The name of your store will be visible to customers, so you should use a name that is recognizable and identifies your store to your customers.',
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
						value={item?.name}
						label={__('Store Name', 'surecart')}
						placeholder={__('Store Name', 'surecart')}
						onScInput={(e) => editItem({ name: e.target.value })}
						help={__(
							'This is displayed in the UI and in notifications.',
							'surecart'
						)}
						required
					></ScInput>

					<ScInput
						value={item?.url}
						label={__('Store URL', 'surecart')}
						placeholder={__('https://example.com', 'surecart')}
						onScInput={(e) => editItem({ url: e.target.value })}
						help={__(
							'This should be your live storefront URL.',
							'surecart'
						)}
						type="url"
					></ScInput>

					<ScSelect
						search
						value={item?.currency}
						onScChange={(e) =>
							editItem({ currency: e.target.value })
						}
						choices={Object.keys(
							scData?.supported_currencies || {}
						).map((value) => {
							const label = scData?.supported_currencies[value];
							return {
								label: `${label} (${getCurrencySymbol(value)})`,
								value,
							};
						})}
						label={__('Default Currency', 'surecart')}
						help={__(
							'The default currency for new products.',
							'surecart'
						)}
						required
					></ScSelect>

					<ScSelect
						search
						value={item?.time_zone}
						onScChange={(e) =>
							editItem({ time_zone: e.target.value })
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
					></ScSelect>

					<ScSelect
						value={item?.locale}
						onScChange={(e) => editItem({ locale: e.target.value })}
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
					></ScSelect>
				</div>
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
				{(scData.processors || []).some(
					(processor) => processor.processor_type === 'stripe'
				) && (
					<ScSwitch
						checked={stripeScriptEnabled}
						onScChange={(e) =>
							setStripeScriptEnabled(e.target.checked)
						}
					>
						{__('Stripe Fraud Monitoring', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
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
					{__('Password Validation', 'surecart')}
					<span slot="description">
						{__(
							'This ensures all the password fields have a stronger validation for user password input i.e. at least 6 characters and one special character.',
							'surecart'
						)}
					</span>
				</ScSwitch>
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
					href={'https://app.surecart.com/account/edit'}
					target="_blank"
					outline
				>
					{__('Clear Test Data', 'surecart')}
					<ScIcon name="external-link" slot="suffix" />
				</ScButton>
			</SettingsBox>
		</SettingsTemplate>
	);
};
