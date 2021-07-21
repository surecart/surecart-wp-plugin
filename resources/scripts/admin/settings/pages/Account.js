const { Card, CardBody, CardFooter, Spinner } = wp.components;
const { __ } = wp.i18n;
const { useSelect, dispatch } = wp.data;
import SaveButton from '../components/SaveButton';
import { CeInput, CeSelect } from '@checkout-engine/react';

export default () => {
	const { settings, loading } = useSelect( ( select ) => {
		return {
			settings: select( 'checkout-engine/settings' ).getSettings(),
			loading: select( 'checkout-engine/settings' ).isResolving(
				'getSettings'
			),
		};
	} );

	if ( loading ) {
		return <Spinner />;
	}

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
					{ /* { settings?.checkout_engine_account?.name } */ }
					<CeInput
						label="Account Name"
						value={ settings?.checkout_engine_account?.name }
						onCeChange={ ( e ) => {
							console.log( e.target.value );
							dispatch(
								'checkout-engine/settings'
							).updateSetting(
								{ name: e.target.value },
								'account'
							);
						} }
					></CeInput>
				</ce-form-row>
				<ce-form-row>
					<CeSelect
						label={ __( 'Default currency', 'checkout_engine' ) }
						value={ settings?.checkout_engine_account?.currency?.toUpperCase() }
						choices={ [
							{
								value: 'AUD',
								label: __(
									'Australia Dollars',
									'checkout_engine'
								),
							},
							{
								value: 'BRL',
								label: __(
									'Brazilian Real',
									'checkout_engine'
								),
							},
							{
								value: 'CAD',
								label: __(
									'Canadian Dollars',
									'checkout_engine'
								),
							},
							{
								value: 'CNY',
								label: __( 'Chinese Yuan', 'checkout_engine' ),
							},
							{
								value: 'CZK',
								label: __( 'Czech Koruna', 'checkout_engine' ),
							},
							{
								value: 'DKK',
								label: __( 'Danish Krone', 'checkout_engine' ),
							},
							{
								value: 'EUR',
								label: __( 'Euros', 'checkout_engine' ),
							},
							{
								value: 'HKD',
								label: __(
									'Hong Kong Dollar',
									'checkout_engine'
								),
							},
							{
								value: 'HUF',
								label: __(
									'Hungarian Forint',
									'checkout_engine'
								),
							},
							{
								value: 'INR',
								label: __( 'Indian Rupee', 'checkout_engine' ),
							},
							{
								value: 'IDR',
								label: __(
									'Indonesia Rupiah',
									'checkout_engine'
								),
							},
							{
								value: 'ILS',
								label: __(
									'Israeli Shekel',
									'checkout_engine'
								),
							},
							{
								value: 'JPY',
								label: __( 'Japanese Yen', 'checkout_engine' ),
							},
							{
								value: 'MXN',
								label: __( 'Mexican Peso', 'checkout_engine' ),
							},
							{
								value: 'NZD',
								label: __(
									'New Zealand Dollar',
									'checkout_engine'
								),
							},
							{
								value: 'NOK',
								label: __(
									'Norwegian Krone',
									'checkout_engine'
								),
							},
							{
								value: 'PHP',
								label: __(
									'Philippine Pesos',
									'checkout_engine'
								),
							},
							{
								value: 'PLN',
								label: __( 'Polish Zloty', 'checkout_engine' ),
							},
							{
								value: 'GBP',
								label: __(
									'Pounds Sterling',
									'checkout_engine'
								),
							},
							{
								value: 'SGD',
								label: __(
									'Singapore Dollar',
									'checkout_engine'
								),
							},
							{
								value: 'ZAR',
								label: __(
									'South African Rand',
									'checkout_engine'
								),
							},
							{
								value: 'KRW',
								label: __(
									'South Korean Won',
									'checkout_engine'
								),
							},
							{
								value: 'SEK',
								label: __( 'Swedish Krona', 'checkout_engine' ),
							},
							{
								value: 'CHF',
								label: __( 'Swiss Franc', 'checkout_engine' ),
							},
							{
								value: 'TWD',
								label: __(
									'Taiwan New Dollars',
									'checkout_engine'
								),
							},
							{
								value: 'THB',
								label: __( 'Thai Baht', 'checkout_engine' ),
							},
							{
								value: 'TRY',
								label: __( 'Turkish Lira', 'checkout_engine' ),
							},
							{
								value: 'USD',
								label: __( 'US Dollars', 'checkout_engine' ),
							},
							{
								value: 'VND',
								label: __(
									'Vietnamese Dong',
									'checkout_engine'
								),
							},
						] }
					></CeSelect>
				</ce-form-row>
			</ce-form-section>

			<SaveButton form="presto-settings-form" />
		</ce-card>
	);
};
