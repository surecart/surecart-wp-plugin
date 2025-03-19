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
			'defaultCountryFields' => $this->getDefaultCountryFields(),
			'countryFields'        => $this->getCountryFields(),
		];
	}

	/**
	 * Get default country fields.
	 *
	 * @return array
	 */
	public function getDefaultCountryFields(): array {
		return apply_filters(
			'surecart_default_country_fields',
			array(
				array(
					'name'     => 'country',
					'priority' => 30,
					'label'    => __( 'Country', 'surecart' ),
				),
				array(
					'name'     => 'name',
					'priority' => 40,
					'label'    => __( 'Name or Company Name', 'surecart' ),
				),
				array(
					'name'     => 'address_1',
					'priority' => 50,
					'label'    => __( 'Address', 'surecart' ),
				),
				array(
					'name'     => 'address_2',
					'priority' => 60,
					'label'    => __( 'Line 2', 'surecart' ),
				),
				array(
					'name'     => 'city',
					'priority' => 70,
					'label'    => __( 'City', 'surecart' ),
				),
				array(
					'name'     => 'state',
					'priority' => 80,
					'label'    => __( 'State / County', 'surecart' ),
				),
				array(
					'name'     => 'postcode',
					'priority' => 90,
					'label'    => __( 'Postal Code', 'surecart' ),
				),
			),
		);
	}

	/**
	 * Get country fields.
	 *
	 * @return array
	 */
	public function getCountryFields(): array {
		return apply_filters(
			'surecart_country_fields',
			array(
				'AL' => array(
					'state' => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'AO' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'DZ' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'AT' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'AU' => array(
					'city'     => array(
						'label' => __( 'Suburb', 'surecart' ),
					),
					'postcode' => array(
						'label' => __( 'Postcode', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'State / Territory', 'surecart' ),
					),
				),
				'AR' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'priority' => 90,
						'label'    => __( 'Province', 'surecart' ),
					),
				),
				'AM' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'AX' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'AZ' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'BA' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Canton', 'surecart' ),
					),
				),
				'BD' => array(
					'state' => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'BE' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'BF' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'BH' => array(
					'postcode' => array(
						'priority' => 75,
					),
				),
				'BO' => array(
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'BB' => array(
					'postcode' => array(
						'priority' => 75,
					),
				),
				'BR' => array(
					'postcode' => array(
						'priority' => 45,
					),
					'state'    => array(
						'label' => __( 'State', 'surecart' ),
					),
				),
				'BY' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'BG' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'CA' => array(
					'postcode' => array(
						'label' => __( 'Postal Code', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'CH' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Canton', 'surecart' ),
					),
				),
				'CL' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'CN' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'CO' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'CR' => array(
					'state' => array(
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					),
					'city'  => array(
						'priority' => 80,
					),
				),
				'CV' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'CY' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'CZ' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'HR' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'DE' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'DK' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'DO' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'EC' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'EE' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'EG' => array(
					'state' => array(
						'label' => __( 'Governorate', 'surecart' ),
					),
				),
				'FI' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'FR' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),

				'GF' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'PF' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'GE' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'GR' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'GL' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'GP' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'GG' => array(
					'state' => array(
						'label' => __( 'Parish', 'surecart' ),
					),
				),
				'GH' => array(
					'state' => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'GT' => array(
					'state' => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'HT' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'HK' => array(
					'city'  => array(
						'label' => __( 'Town / District', 'surecart' ),
					),
					'state' => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'HN' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'HU' => array(
					'postcode'  => array(
						'priority' => 65,
					),
					'address_1' => array(
						'priority' => 71,
					),
					'address_2' => array(
						'priority' => 72,
					),
					'state'     => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'ID' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'IE' => array(
					'postcode' => array(
						'label' => __( 'Eircode', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'IS' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'IL' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'IN' => array(
					'postcode' => array(
						'label' => __( 'PIN Code', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'State', 'surecart' ),
					),
				),
				'IR' => array(
					'state'     => array(
						'priority' => 50,
					),
					'city'      => array(
						'priority' => 60,
					),
					'address_1' => array(
						'priority' => 70,
					),
					'address_2' => array(
						'priority' => 80,
					),
				),
				'IT' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'JM' => array(
					'city'     => array(
						'label' => __( 'Town / City / Post Office', 'surecart' ),
					),
					'postcode' => array(
						'label' => __( 'Postal Code', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'Parish', 'surecart' ),
					),
				),
				'JP' => array(
					'postcode'  => array(
						'priority' => 65,
					),
					'state'     => array(
						'label'    => __( 'Prefecture', 'surecart' ),
						'priority' => 66,
					),
					'city'      => array(
						'priority' => 67,
					),
					'address_1' => array(
						'priority' => 68,
					),
					'address_2' => array(
						'priority' => 69,
					),
				),
				'KN' => array(
					'postcode' => array(
						'label' => __( 'Postal Code', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'Parish', 'surecart' ),
					),
				),
				'KW' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Governorate', 'surecart' ),
					),
				),
				'KG' => array(
					'postcode'  => array(
						'priority' => 65,
					),
					'city'      => array(
						'priority' => 70,
					),
					'state'     => array(
						'priority' => 80,
					),
					'address_1' => array(
						'priority' => 85,
					),
					'name'      => array(
						'priority' => 90,
					),
				),
				'LV' => array(
					'state' => array(
						'label' => __( 'Municipality', 'surecart' ),
					),
				),
				'LU' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'MZ' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'MX' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'State', 'surecart' ),
					),
				),
				'MY' => array(
					'postcode' => array(
						'priority' => 65,
						'label'    => __( 'Postcode', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'State / Territory', 'surecart' ),
					),
				),
				'NI' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'NL' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'MK' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'NG' => array(
					'postcode' => array(
						'label' => __( 'Postcode', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'State', 'surecart' ),
					),
				),
				'NZ' => array(
					'postcode' => array(
						'label' => __( 'Postcode', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'NO' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'NP' => array(
					'state' => array(
						'label' => __( 'State / Zone', 'surecart' ),
					),
				),
				'NC' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'OM' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'PA' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'PL' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'PR' => array(
					'city' => array(
						'label' => __( 'Municipality', 'surecart' ),
					),
				),
				'PY' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'PH' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'priority' => 90,
						'label'    => __( 'Region', 'surecart' ),
					),
				),
				'PE' => array(
					'state' => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'PT' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'RO' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'RS' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'RU' => array(
					'state' => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'SM' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'KR' => array(
					'postcode'  => array(
						'priority' => 50,
					),
					'city'      => array(
						'priority' => 80,
					),
					'state'     => array(
						'priority' => 70,
						'label'    => __( 'Province', 'surecart' ),
					),
					'address_1' => array(
						'priority' => 90,
					),
				),
				'SA' => array(
					'state' => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'SN' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'SD' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'SK' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'SI' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'SV' => array(
					'postcode' => array(
						'priority' => 80,
					),
					'state'    => array(
						'priority' => 90,
						'label'    => __( 'Region', 'surecart' ),
					),
				),
				'SJ' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'TJ' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'TH' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'TM' => array(
					'postcode'  => array(
						'priority' => 65,
					),
					'city'      => array(
						'priority' => 70,
					),
					'name'      => array(
						'priority' => 75,
					),
					'address_1' => array(
						'priority' => 80,
					),
				),
				'ES' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'FO' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'LI' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'MD' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Municipality / District', 'surecart' ),
					),
				),
				'MC' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'ME' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'SE' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'TR' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'UG' => array(
					'city'  => array(
						'label' => __( 'Town / Village', 'surecart' ),
					),
					'state' => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'US' => array(
					'postcode' => array(
						'label' => __( 'ZIP Code', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'State', 'surecart' ),
					),
				),
				'UY' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label' => __( 'Region', 'surecart' ),
					),
				),
				'AE' => array(
					'state' => array(
						'label' => __( 'Emirate', 'surecart' ),
					),
				),
				'GB' => array(
					'postcode' => array(
						'label' => __( 'Postcode', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'ST' => array(
					'state' => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'VE' => array(
					'postcode' => array(
						'priority' => 75,
					),
					'state'    => array(
						'label' => __( 'State', 'surecart' ),
					),
				),
				'VN' => array(
					'postcode' => array(
						'priority' => 75,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'WF' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'ZM' => array(
					'postcode' => array(
						'priority' => 65,
					),
				),
				'ZA' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
			)
		);
	}
}
