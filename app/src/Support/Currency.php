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
	public static function getSupportedCurrencies() {
		return [
			'aud' => __( 'Australia Dollars', 'checkout_engine' ),
			'brl' => __( 'Brazilian Real', 'checkout_engine' ),
			'cad' => __( 'Canadian Dollars', 'checkout_engine' ),
			'cny' => __( 'Chinese Yuan', 'checkout_engine' ),
			'czk' => __( 'Czech Koruna', 'checkout_engine' ),
			'dkk' => __( 'Danish Krone', 'checkout_engine' ),
			'eur' => __( 'Euros', 'checkout_engine' ),
			'hkd' => __( 'Hong Kong Dollar', 'checkout_engine' ),
			'huf' => __( 'Hungarian Forint', 'checkout_engine' ),
			'inr' => __( 'Indian Rupee', 'checkout_engine' ),
			'idr' => __( 'Indonesia Rupiah', 'checkout_engine' ),
			'ils' => __( 'Israeli Shekel', 'checkout_engine' ),
			'jpy' => __( 'Japanese Yen', 'checkout_engine' ),
			'mxn' => __( 'Mexican Peso', 'checkout_engine' ),
			'nzd' => __( 'New Zealand Dollar', 'checkout_engine' ),
			'nok' => __( 'Norwegian Krone', 'checkout_engine' ),
			'php' => __( 'Philippine Pesos', 'checkout_engine' ),
			'pln' => __( 'Polish Zloty', 'checkout_engine' ),
			'gbp' => __( 'Pounds Sterling', 'checkout_engine' ),
			'sgd' => __( 'Singapore Dollar', 'checkout_engine' ),
			'zar' => __( 'South African Rand', 'checkout_engine' ),
			'krw' => __( 'South Korean Won', 'checkout_engine' ),
			'sek' => __( 'Swedish Krona', 'checkout_engine' ),
			'chf' => __( 'Swiss Franc', 'checkout_engine' ),
			'twd' => __( 'Taiwan New Dollars', 'checkout_engine' ),
			'thb' => __( 'Thai Baht', 'checkout_engine' ),
			'try' => __( 'Turkish Lira', 'checkout_engine' ),
			'usd' => __( 'US Dollars', 'checkout_engine' ),
			'vnd' => __( 'Vietnamese Dong', 'checkout_engine' ),
		];
	}
}
