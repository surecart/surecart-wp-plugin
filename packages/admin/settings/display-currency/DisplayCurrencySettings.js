/** @jsx jsx */
import { __, sprintf, _n } from '@wordpress/i18n';
import { css, jsx, Global } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import {
	ScAlert,
	ScIcon,
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';
import { useEntityProp } from '@wordpress/core-data';
import { useState } from 'react';
import useSave from '../UseSave';
import Error from '../../components/Error';
import CurrencySwitcherSettings from './components/CurrencySwitcherSettings';
import DisplayCurrenciesSettings from './components/DisplayCurrenciesSettings';

export default function DisplayCurrencySettings() {
	const [error, setError] = useState(null);
	const { save } = useSave();

	// honeypot.
	const [currencyGeolocationEnabled, setCurrencyGeolocationEnabled] =
		useEntityProp('root', 'site', 'surecart_currency_geolocation_enabled');

	const [selectedLocale, setSelectedLocale] = useEntityProp(
		'root',
		'site',
		'surecart_currency_locale'
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

	const locales = scData?.locales || {};
	const translationChoices = Object.keys(locales).map((key) => ({
		label: locales[key]?.native_name,
		value: key,
	}));

	return (
		<>
			<Global
				styles={css`
					.sc-content {
						--sc-settings-content-width: 1000px;
					}
				`}
			/>
			<SettingsTemplate
				title={__('Currency Settings', 'surecart')}
				icon={<ScIcon name="dollar-sign" />}
				css={css`
					margin-bottom: 60px;
				`}
				onSubmit={onSubmit}
			>
				<Error error={error} setError={setError} margin="80px" />

				<DisplayCurrenciesSettings />

				{!scData?.is_block_theme && (
					<SettingsBox
						title={__('Currency Switcher', 'surecart')}
						description={__(
							'Set the currency switcher settings for your site.',
							'surecart'
						)}
					>
						<CurrencySwitcherSettings />
					</SettingsBox>
				)}

				<SettingsBox
					title={__('Currency Formatting', 'surecart')}
					description={sprintf(
						__(
							'Choose the locale to format the currency. By default, your site locale (%s) will be used.',
							'surecart'
						),
						locales['default']?.native_name
					)}
				>
					<ScSelect
						search={true}
						label={__('Formatting Locale', 'surecart')}
						placeholder={__('Select Currency Locale', 'surecart')}
						help={__(
							'The locale determines how the currency is displayed. For instance, if your site is in Spanish but you prefer to display currency in United States Dollars formatted as in the United States (without the "USD" prefix), you can select "English (United States)."',
							'surecart'
						)}
						value={selectedLocale || 'default'}
						onScChange={(e) => setSelectedLocale(e.target.value)}
						unselect={false}
						required={true}
						choices={translationChoices}
					/>
				</SettingsBox>

				<SettingsBox
					title={__('Geolocation', 'surecart')}
					description={__(
						'Set the currency geolocation settings for your site.',
						'surecart'
					)}
				>
					<ScSwitch
						checked={currencyGeolocationEnabled}
						name="currency_geolocation_enabled"
						onScChange={(e) =>
							setCurrencyGeolocationEnabled(e.target.checked)
						}
					>
						{__('Geolocation', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								"Use the user's location to determine which currency to display initially. NOTE: This may not work if the user is using a VPN, proxy, or you are caching your site pages. This only affects the initial currency selection, visitors can choose a different currency from the currency switcher.",
								'surecart'
							)}
						</span>
					</ScSwitch>
				</SettingsBox>

				{!!scData?.is_block_theme && (
					<ScAlert type="info" open={true}>
						{__(
							'To add a currency switcher, add the currency switcher block to your site template.',
							'surecart'
						)}
					</ScAlert>
				)}
			</SettingsTemplate>
		</>
	);
}
