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
					'name'     => 'name',
					'priority' => 30,
					'label'    => __( 'Name or Company Name', 'surecart' ),
					'hidden'   => false,
				),
				array(
					'name'     => 'country',
					'priority' => 40,
					'label'    => __( 'Country', 'surecart' ),
					'hidden'   => false,
				),
				array(
					'name'     => 'address_1',
					'priority' => 50,
					'label'    => __( 'Address', 'surecart' ),
					'hidden'   => false,
				),
				array(
					'name'     => 'address_2',
					'priority' => 60,
					'label'    => __( 'Address Line 2', 'surecart' ),
					'hidden'   => false,
				),
				array(
					'name'     => 'city',
					'priority' => 70,
					'label'    => __( 'City', 'surecart' ),
					'hidden'   => false,
				),
				array(
					'name'     => 'state',
					'priority' => 80,
					'label'    => __( 'State/Country', 'surecart' ),
					'hidden'   => false,
				),
				array(
					'name'     => 'postcode',
					'priority' => 90,
					'label'    => __( 'Postal Code', 'surecart' ),
					'hidden'   => false,
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
				'AE' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
				'AF' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'AL' => array(
					'state' => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'AO' => array(
					'postcode' => array(
						'hidden' => true,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'AT' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
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
						'label' => __( 'State', 'surecart' ),
					),
				),
				'AX' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'BA' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'label'  => __( 'Canton', 'surecart' ),
						'hidden' => true,
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
					'state'    => array(
						'hidden' => true,
					),
				),
				'BH' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'BI' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'BO' => array(
					'postcode' => array(
						'hidden' => true,
					),
					'state'    => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'BS' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
				'BZ' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
				'CA' => array(
					'postcode' => array(
						'label' => __( 'Postal code', 'surecart' ),
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
					'city'     => array(
						'required' => true,
					),
					'postcode' => array(
						'hidden' => false,
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
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'CR' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'CW' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
				'CY' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'CZ' => array(
					'state' => array(
						'hidden' => true,
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
					'state'    => array(
						'hidden' => true,
					),
				),
				'DO' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'EC' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'EE' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'ET' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'FI' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'FR' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
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
				'GP' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'GF' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'GT' => array(
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
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
					'state' => array(
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
					'state'    => array(
						'hidden' => true,
					),
				),
				'IL' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'IM' => array(
					'state' => array(
						'hidden' => true,
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
						'required' => true,
						'label'    => __( 'Province', 'surecart' ),
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
						'required' => true,
						'label'    => __( 'Parish', 'surecart' ),
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
						'label' => __( 'Postal code', 'surecart' ),
					),
					'state'    => array(
						'required' => true,
						'label'    => __( 'Parish', 'surecart' ),
					),
				),
				'KR' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'KW' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'LV' => array(
					'state' => array(
						'label' => __( 'Municipality', 'surecart' ),
					),
				),
				'LB' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'MF' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'MQ' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'MT' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'MZ' => array(
					'postcode' => array(
						'hidden' => true,
					),
					'state'    => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'NI' => array(
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'NL' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'NG' => array(
					'postcode' => array(
						'label'  => __( 'Postcode', 'surecart' ),
						'hidden' => true,
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
					'state'    => array(
						'hidden' => true,
					),
				),
				'NP' => array(
					'state' => array(
						'label' => __( 'State / Zone', 'surecart' ),
					),
				),
				'PA' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'PL' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'PR' => array(
					'city'  => array(
						'label' => __( 'Municipality', 'surecart' ),
					),
					'state' => array(
						'hidden' => true,
					),
				),
				'PT' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'PY' => array(
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'RE' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'RO' => array(
					'state' => array(
						'label'    => __( 'County', 'surecart' ),
						'required' => true,
					),
				),
				'RS' => array(
					'city'     => array(
						'required' => true,
					),
					'postcode' => array(
						'required' => true,
					),
					'state'    => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'RW' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'SG' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'SK' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'SI' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'SR' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
				'SV' => array(
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
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
				'LI' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
					),
				),
				'LK' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'LU' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'MD' => array(
					'state' => array(
						'label' => __( 'Municipality / District', 'surecart' ),
					),
				),
				'SE' => array(
					'postcode' => array(
						'priority' => 65,
					),
					'state'    => array(
						'hidden' => true,
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
					'postcode' => array(
						'hidden' => true,
					),
					'city'     => array(
						'label'    => __( 'Town / Village', 'surecart' ),
						'required' => true,
					),
					'state'    => array(
						'label'    => __( 'District', 'surecart' ),
						'required' => true,
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
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
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
					'postcode' => array(
						'hidden' => true,
					),
					'state'    => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'VN' => array(
					'state'     => array(
						'hidden' => true,
					),
					'postcode'  => array(
						'priority' => 65,
						'hidden'   => false,
					),
					'address_2' => array(
						'hidden' => false,
					),
				),
				'WS' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
				'YT' => array(
					'state' => array(
						'hidden' => true,
					),
				),
				'ZA' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
					),
				),
				'ZW' => array(
					'postcode' => array(
						'hidden' => true,
					),
				),
			)
		);
	}
}
