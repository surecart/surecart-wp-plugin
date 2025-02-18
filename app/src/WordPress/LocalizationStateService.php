<?php

namespace SureCart\WordPress;

/**
 * LocalizationStateService class.
 */
class LocalizationStateService {
	/**
	 * Get the localization state.
	 */
	public function get() {
		return [
			'defaultLocale' => $this->getDefaultLocale(),
			'locales'       => $this->getCountryLocales(),
		];
	}

	/**
	 * Get default locale.
	 *
	 * @return array
	 */
	public function getDefaultLocale() {
		return apply_filters(
			'surecart_default_locale',
			[
				[
					'name'     => 'name',
					'priority' => 30,
					'label'    => __( 'Name or Company Name', 'surecart' ),
				],
				[
					'name'     => 'address_1',
					'priority' => 50,
					'label'    => __( 'Address', 'surecart' ),
				],
				[
					'name'     => 'address_2',
					'priority' => 60,
					'label'    => __( 'Address Line 2', 'surecart' ),
				],
				[
					'name'     => 'city',
					'priority' => 70,
					'label'    => __( 'City', 'surecart' ),
				],
				[
					'name'     => 'state',
					'priority' => 80,
					'label'    => __( 'State/Province/Region', 'surecart' ),
				],
				[
					'name'     => 'postcode',
					'priority' => 90,
					'label'    => __( 'Postal Code/Zip', 'surecart' ),
				],
			]
		);
	}

	/**
	 * Get country locales.
	 *
	 * @return array
	 */
	public function getCountryLocales() {
		return apply_filters(
			'surecart_get_country_locales',
			[
				'AE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'AF' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'AL' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'AO' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'AT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'AU' => [
					'city'     => [
						'priority' => 60,
						'label'    => __( 'Suburb', 'surecart' ),
					],
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'AX' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'BA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Canton', 'surecart' ),
					],
				],
				'BD' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'District', 'surecart' ),
					],
				],
				'BE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'BG' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'BH' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'BI' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'BO' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'BS' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'BZ' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'CA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postal code', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'CH' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Canton', 'surecart' ),
					],
				],
				'CL' => [
					'city'     => [
						'priority' => 60,
						'label'    => __( 'City', 'surecart' ),
					],
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'CN' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'CO' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'CR' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'CW' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'CY' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'CZ' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'DE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'DK' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'DO' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'EC' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'EE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'ET' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'FI' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'FR' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'GG' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Parish', 'surecart' ),
					],
				],
				'GH' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'GP' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'GF' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'GR' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'GT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'HK' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'city'     => [
						'priority' => 60,
						'label'    => __( 'Town / District', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'HN' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'HU' => [
					'postcode'  => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'address_1' => [
						'priority' => 71,
						'label'    => __( 'Address Line 1', 'surecart' ),
					],
					'address_2' => [
						'priority' => 72,
						'label'    => __( 'Address Line 2', 'surecart' ),
					],
					'state'     => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'ID' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'IE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Eircode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'IS' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'IL' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'IM' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'IN' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'PIN Code', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'IR' => [
					'state'     => [
						'priority' => 50,
						'label'    => __( 'State', 'surecart' ),
					],
					'city'      => [
						'priority' => 60,
						'label'    => __( 'City', 'surecart' ),
					],
					'address_1' => [
						'priority' => 70,
						'label'    => __( 'Address Line 1', 'surecart' ),
					],
					'address_2' => [
						'priority' => 80,
						'label'    => __( 'Address Line 2', 'surecart' ),
					],
				],
				'IT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'JM' => [
					'city'     => [
						'priority' => 60,
						'label'    => __( 'Town / City / Post Office', 'surecart' ),
					],
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postal Code', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Parish', 'surecart' ),
					],
				],
				'JP' => [
					'postcode'  => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'     => [
						'priority' => 66,
						'label'    => __( 'Prefecture', 'surecart' ),
					],
					'city'      => [
						'priority' => 67,
						'label'    => __( 'City', 'surecart' ),
					],
					'address_1' => [
						'priority' => 68,
						'label'    => __( 'Address Line 1', 'surecart' ),
					],
					'address_2' => [
						'priority' => 69,
						'label'    => __( 'Address Line 2', 'surecart' ),
					],
				],
				'KE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'KR' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'KW' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'LI' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'LK' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'LT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'LU' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'LV' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'MA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'MC' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'MD' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'ME' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Municipality', 'surecart' ),
					],
				],
				'MK' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Municipality', 'surecart' ),
					],
				],
				'MN' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'MO' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'MT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'MU' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'MV' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'MW' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'MX' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'MY' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'MZ' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'NA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'NC' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'NE' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'NG' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'NI' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'NL' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'NO' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'NP' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'NZ' => [
					'city'     => [
						'priority' => 60,
						'label'    => __( 'Suburb', 'surecart' ),
					],
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'OM' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'PA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'PE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'PF' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'PG' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'PH' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'PK' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'PL' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'PT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'PY' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'QA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'RE' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'RO' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'RS' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Municipality', 'surecart' ),
					],
				],
				'RU' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'RW' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'SA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'SC' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'SE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'SG' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'SI' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Municipality', 'surecart' ),
					],
				],
				'SK' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'SM' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'SN' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'SV' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'TH' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'TN' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Governorate', 'surecart' ),
					],
				],
				'TR' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'TT' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'TW' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'County', 'surecart' ),
					],
				],
				'TZ' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Region', 'surecart' ),
					],
				],
				'UA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'UG' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'District', 'surecart' ),
					],
				],
				'US' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'ZIP', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'UY' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Department', 'surecart' ),
					],
				],
				'VA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
				],
				'VE' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'VN' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'YT' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'State', 'surecart' ),
					],
				],
				'ZA' => [
					'postcode' => [
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					],
					'state'    => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'ZM' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
				'ZW' => [
					'state' => [
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					],
				],
			]
		);
	}
}
