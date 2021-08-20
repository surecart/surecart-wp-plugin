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
		if ( class_exists( 'NumberFormatter' ) ) {
			$fmt = new NumberFormatter( get_locale(), NumberFormatter::CURRENCY );
			return $fmt->formatCurrency( $amount, $currency_code );
		}
		return $amount;
	}


	/**
	 * Format the currency number
	 */
	public static function formatCurrencyNumber( $amount, $currency_code = 'usd' ) {
		$amount = (float) $amount;
		// TODO: Test this.
		if ( in_array( strtolower( $currency_code ), [ 'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw' ], true ) ) {
			return self::formatCents( $amount, 1 );
		}
		return self::formatCents( $amount / 100, 1 );
	}

	public static function formatCents( $number, $cents = 1 ) {
		// cents: 0=never, 1=if needed, 2=always.
		if ( is_numeric( $number ) ) { // a number.
			if ( ! $number ) { // zero.
				$money = ( 2 === $cents ? '0.00' : '0' ); // output zero.
			} else { // value.
				if ( floor( $number ) == $number ) { // whole number.
					$money = number_format( $number, ( 2 === $cents ? 2 : 0 ) ); // format.
				} else { // cents.
					$money = number_format( round( $number, 2 ), ( 0 === $cents ? 0 : 2 ) ); // format.
				} // integer or decimal.
			} // value.
			return $money;
		} // numeric.
	}

	/**
	 * Get a list of supported currencies.
	 *
	 * @param string $provider Provider.
	 */
	public static function getSupportedCurrencies( $provider = 'stripe' ) {
		if ( 'stripe' === $provider ) {
			return [
				'AUD' => __( 'Australia Dollars', 'checkout_engine' ),
				'BRL' => __( 'Brazilian Real', 'checkout_engine' ),
				'CAD' => __( 'Canadian Dollars', 'checkout_engine' ),
				'CNY' => __( 'Chinese Yuan', 'checkout_engine' ),
				'CZK' => __( 'Czech Koruna', 'checkout_engine' ),
				'DKK' => __( 'Danish Krone', 'checkout_engine' ),
				'EUR' => __( 'Euros', 'checkout_engine' ),
				'HKD' => __( 'Hong Kong Dollar', 'checkout_engine' ),
				'HUF' => __( 'Hungarian Forint', 'checkout_engine' ),
				'INR' => __( 'Indian Rupee', 'checkout_engine' ),
				'IDR' => __( 'Indonesia Rupiah', 'checkout_engine' ),
				'ILS' => __( 'Israeli Shekel', 'checkout_engine' ),
				'JPY' => __( 'Japanese Yen', 'checkout_engine' ),
				'MXN' => __( 'Mexican Peso', 'checkout_engine' ),
				'NZD' => __( 'New Zealand Dollar', 'checkout_engine' ),
				'NOK' => __( 'Norwegian Krone', 'checkout_engine' ),
				'PHP' => __( 'Philippine Pesos', 'checkout_engine' ),
				'PLN' => __( 'Polish Zloty', 'checkout_engine' ),
				'GBP' => __( 'Pounds Sterling', 'checkout_engine' ),
				'SGD' => __( 'Singapore Dollar', 'checkout_engine' ),
				'ZAR' => __( 'South African Rand', 'checkout_engine' ),
				'KRW' => __( 'South Korean Won', 'checkout_engine' ),
				'SEK' => __( 'Swedish Krona', 'checkout_engine' ),
				'CHF' => __( 'Swiss Franc', 'checkout_engine' ),
				'TWD' => __( 'Taiwan New Dollars', 'checkout_engine' ),
				'THB' => __( 'Thai Baht', 'checkout_engine' ),
				'TRY' => __( 'Turkish Lira', 'checkout_engine' ),
				'USD' => __( 'US Dollars', 'checkout_engine' ),
				'VND' => __( 'Vietnamese Dong', 'checkout_engine' ),
			];
		}
	}
}
