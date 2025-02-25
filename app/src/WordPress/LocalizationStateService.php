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
				),
				array(
					'name'     => 'country',
					'priority' => 40,
					'label'    => __( 'Country', 'surecart' ),
				),
				array(
					'name'     => 'address_1',
					'priority' => 50,
					'label'    => __( 'Address', 'surecart' ),
				),
				array(
					'name'     => 'address_2',
					'priority' => 60,
					'label'    => __( 'Address Line 2', 'surecart' ),
				),
				array(
					'name'     => 'city',
					'priority' => 70,
					'label'    => __( 'City', 'surecart' ),
				),
				array(
					'name'     => 'state',
					'priority' => 80,
					'label'    => __( 'State/Country', 'surecart' ),
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
						'label' => __( 'State', 'surecart' ),
					),
				),
				'AX' => array(
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
				'BO' => array(
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
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
					'state' => array(
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
						'label' => __( 'Postal code', 'surecart' ),
					),
					'state'    => array(
						'label' => __( 'Parish', 'surecart' ),
					),
				),
				'LV' => array(
					'state' => array(
						'label' => __( 'Municipality', 'surecart' ),
					),
				),
				'MZ' => array(
					'state' => array(
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
				'PA' => array(
					'state' => array(
						'label' => __( 'Province', 'surecart' ),
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
					'state' => array(
						'label' => __( 'Department', 'surecart' ),
					),
				),
				'RO' => array(
					'state' => array(
						'label' => __( 'County', 'surecart' ),
					),
				),
				'RS' => array(
					'state' => array(
						'label' => __( 'District', 'surecart' ),
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
					'state' => array(
						'label' => __( 'District', 'surecart' ),
					),
				),
				'VN' => array(
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
