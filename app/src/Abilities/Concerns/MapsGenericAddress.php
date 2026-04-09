<?php

namespace SureCart\Abilities\Concerns;

/**
 * Maps generic `{prefix}_*` address fields from ability input into a nested address
 * array (`city`, `country`, `line_1`, …) for the SureCart API.
 */
trait MapsGenericAddress {

	/**
	 * Map prefixed address keys in ability input to a nested address array.
	 *
	 * @param array  $input  The input data.
	 * @param string $prefix The key prefix without trailing underscore (e.g. `shipping_address`).
	 *
	 * @return array
	 */
	protected function map_generic_address( array $input, string $prefix ): array {
		$address        = array();
		$address_fields = array( 'city', 'country', 'line_1', 'line_2', 'postal_code', 'state' );

		foreach ( $address_fields as $key ) {
			$input_key = $prefix . '_' . $key;
			if ( ! empty( $input[ $input_key ] ) ) {
				$address[ $key ] = sanitize_text_field( $input[ $input_key ] );
			}
		}

		return $address;
	}
}
