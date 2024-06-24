<?php

if ( ! function_exists( 'sc_get_human_discount_redeemable_status' ) ) {
	/**
	 * Get the human discount redeemable status.
	 *
	 * @param string $status The status.
	 *
	 * @return string
	 */
	function sc_get_human_discount_redeemable_status( $status ) {
		switch ( $status ) {
			case 'invalid':
				return __( 'Not valid', 'surecart' );
			case 'expired':
				return __( 'Expired', 'surecart' );
			case 'gone':
				return __( 'Not available', 'surecart' );
			case 'less_than_min_subtotal_amount':
				return __( 'Minimum not met', 'surecart' );
			case 'greater_than_max_subtotal_amount':
				return __( 'Order too large', 'surecart' );
			case 'not_applicable':
				return __( 'Product(s) not eligible', 'surecart' );
			case 'not_applicable_to_customer':
				return __( 'Not eligible', 'surecart' );
			case '':
				return '';
			default:
				return __( 'Not redeemable', 'surecart' );
		}
	}
}