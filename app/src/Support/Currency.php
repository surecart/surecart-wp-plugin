<?php

namespace CheckoutEngine\Support;

use NumberFormatter;

/**
 * Handles currency coversion and formatting
 */
class Currency {
	/**
	 * Format the currency into the current locale.
	 *
	 * @param integer $amount Amount as an integer.
	 * @param string  $currency_code 3 digit currency code.
	 *
	 * @return string
	 */
	public static function format( $amount, $currency_code = 'USD' ) {
		$fmt = new NumberFormatter( get_locale(), NumberFormatter::CURRENCY );
		return $fmt->formatCurrency( $amount, $currency_code );
	}
}
