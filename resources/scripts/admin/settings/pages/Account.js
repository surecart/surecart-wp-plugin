const { Card, CardBody, CardFooter, Spinner } = wp.components;
const { __ } = wp.i18n;
const { useSelect, dispatch } = wp.data;
import SaveButton from '../components/SaveButton';
import { CeInput, CeSelect } from '@checkout-engine/react';

export default () => {
	const { settings, loading } = useSelect( ( select ) => {
		return {
			settings: select( 'checkout-engine/settings' ).getSetting(
				'account'
			),
			loading: select( 'checkout-engine/settings' ).isResolving(
				'getSetting'
			),
		};
	} );

	if ( loading ) {
		return <Spinner />;
	}

	const currency = settings?.currency?.toUpperCase();

	return (
		<ce-card>
			<ce-form-section>
				<span slot="label">
					{ __( 'Account Settings', 'checkout_engine' ) }
				</span>
				<span slot="description">
					{ __(
						'Your Checkout Engine account settings',
						'checkout_engine'
					) }
				</span>
				<ce-form-row>
					test: { JSON.stringify( settings ) }
					<CeInput
						label="Account Name"
						value={ settings?.name }
						onCeChange={ ( e ) =>
							dispatch(
								'checkout-engine/settings'
							).updateSetting(
								{ name: e.target.value },
								'account'
							)
						}
					></CeInput>
				</ce-form-row>
				<ce-form-row>
					<CeSelect
						label={ __( 'Default currency', 'checkout_engine' ) }
						onChoice={ ( e ) => console.log( e ) }
						onCeChange={ ( e ) =>
							dispatch(
								'checkout-engine/settings'
							).updateSetting(
								{ currency: e.target.value },
								'account'
							)
						}
						choices={ [
							{
								value: 'AUD',
								label: __(
									'Australia Dollars',
									'checkout_engine'
								),
								selected: currency === 'AUD',
							},
							{
								value: 'BRL',
								label: __(
									'Brazilian Real',
									'checkout_engine'
								),
								selected: currency === 'BRL',
							},
							{
								value: 'CAD',
								label: __(
									'Canadian Dollars',
									'checkout_engine'
								),
								selected: currency === 'CAD',
							},
							{
								value: 'CNY',
								label: __( 'Chinese Yuan', 'checkout_engine' ),
								selected: currency === 'CNY',
							},
							{
								value: 'CZK',
								label: __( 'Czech Koruna', 'checkout_engine' ),
								selected: currency === 'CZK',
							},
							{
								value: 'DKK',
								label: __( 'Danish Krone', 'checkout_engine' ),
								selected: currency === 'DKK',
							},
							{
								value: 'EUR',
								label: __( 'Euros', 'checkout_engine' ),
								selected: currency === 'EUR',
							},
							{
								value: 'HKD',
								label: __(
									'Hong Kong Dollar',
									'checkout_engine'
								),
								selected: currency === 'HKD',
							},
							{
								value: 'HUF',
								label: __(
									'Hungarian Forint',
									'checkout_engine'
								),
								selected: currency === 'HUF',
							},
							{
								value: 'INR',
								label: __( 'Indian Rupee', 'checkout_engine' ),
								selected: currency === 'INR',
							},
							{
								value: 'IDR',
								label: __(
									'Indonesia Rupiah',
									'checkout_engine'
								),
								selected: currency === 'IDR',
							},
							{
								value: 'ILS',
								label: __(
									'Israeli Shekel',
									'checkout_engine'
								),
								selected: currency === 'ILS',
							},
							{
								value: 'JPY',
								label: __( 'Japanese Yen', 'checkout_engine' ),
								selected: currency === 'JPY',
							},
							{
								value: 'MXN',
								label: __( 'Mexican Peso', 'checkout_engine' ),
								selected: currency === 'MXN',
							},
							{
								value: 'NZD',
								label: __(
									'New Zealand Dollar',
									'checkout_engine'
								),
								selected: currency === 'NZD',
							},
							{
								value: 'NOK',
								label: __(
									'Norwegian Krone',
									'checkout_engine'
								),
								selected: currency === 'NOK',
							},
							{
								value: 'PHP',
								label: __(
									'Philippine Pesos',
									'checkout_engine'
								),
								selected: currency === 'PHP',
							},
							{
								value: 'PLN',
								label: __( 'Polish Zloty', 'checkout_engine' ),
								selected: currency === 'PLN',
							},
							{
								value: 'GBP',
								label: __(
									'Pounds Sterling',
									'checkout_engine'
								),
								selected: currency === 'GBP',
							},
							{
								value: 'SGD',
								label: __(
									'Singapore Dollar',
									'checkout_engine'
								),
								selected: currency === 'SGD',
							},
							{
								value: 'ZAR',
								label: __(
									'South African Rand',
									'checkout_engine'
								),
								selected: currency === 'ZAR',
							},
							{
								value: 'KRW',
								label: __(
									'South Korean Won',
									'checkout_engine'
								),
								selected: currency === 'KRN',
							},
							{
								value: 'SEK',
								label: __( 'Swedish Krona', 'checkout_engine' ),
								selected: currency === 'SEK',
							},
							{
								value: 'CHF',
								label: __( 'Swiss Franc', 'checkout_engine' ),
								selected: currency === 'CHF',
							},
							{
								value: 'TWD',
								label: __(
									'Taiwan New Dollars',
									'checkout_engine'
								),
								selected: currency === 'TWD',
							},
							{
								value: 'THB',
								label: __( 'Thai Baht', 'checkout_engine' ),
								selected: currency === 'THB',
							},
							{
								value: 'TRY',
								label: __( 'Turkish Lira', 'checkout_engine' ),
								selected: currency === 'TRY',
							},
							{
								value: 'USD',
								label: __( 'US Dollars', 'checkout_engine' ),
								selected: currency === 'USD',
							},
							{
								value: 'VND',
								label: __(
									'Vietnamese Dong',
									'checkout_engine'
								),
								selected: currency === 'VND',
							},
						] }
					></CeSelect>
				</ce-form-row>
			</ce-form-section>

			<SaveButton form="presto-settings-form" />
		</ce-card>
	);
};
