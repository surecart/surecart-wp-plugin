<?php

namespace SureCart\Support;

/**
 * Handles currency coversion and formatting
 */
class Currency {
	/**
	 * Get all available Currency symbols.
	 * Currency symbols and names should follow the Unicode CLDR recommendation (http://cldr.unicode.org/translation/currency-names)
	 */
	public static function getCurrencySymbol( $key ) {
		$key     = strtoupper( $key );
		$symbols = apply_filters(
			'surecart/currency_symbols',
			array(
				'AED' => '&#x62f;.&#x625;',
				'AFN' => '&#x60b;',
				'ALL' => 'L',
				'AMD' => 'AMD',
				'ANG' => '&fnof;',
				'AOA' => 'Kz',
				'ARS' => '&#36;',
				'AUD' => '&#36;',
				'AWG' => 'Afl.',
				'AZN' => 'AZN',
				'BAM' => 'KM',
				'BBD' => '&#36;',
				'BDT' => '&#2547;&nbsp;',
				'BGN' => '&#1083;&#1074;.',
				'BHD' => '.&#x62f;.&#x628;',
				'BIF' => 'Fr',
				'BMD' => '&#36;',
				'BND' => '&#36;',
				'BOB' => 'Bs.',
				'BRL' => '&#82;&#36;',
				'BSD' => '&#36;',
				'BTC' => '&#3647;',
				'BTN' => 'Nu.',
				'BWP' => 'P',
				'BYR' => 'Br',
				'BYN' => 'Br',
				'BZD' => '&#36;',
				'CAD' => '&#36;',
				'CDF' => 'Fr',
				'CHF' => '&#67;&#72;&#70;',
				'CLP' => '&#36;',
				'CNY' => '&yen;',
				'COP' => '&#36;',
				'CRC' => '&#x20a1;',
				'CUC' => '&#36;',
				'CUP' => '&#36;',
				'CVE' => '&#36;',
				'CZK' => '&#75;&#269;',
				'DJF' => 'Fr',
				'DKK' => 'DKK',
				'DOP' => 'RD&#36;',
				'DZD' => '&#x62f;.&#x62c;',
				'EGP' => 'EGP',
				'ERN' => 'Nfk',
				'ETB' => 'Br',
				'EUR' => '&euro;',
				'FJD' => '&#36;',
				'FKP' => '&pound;',
				'GBP' => '&pound;',
				'GEL' => '&#x20be;',
				'GGP' => '&pound;',
				'GHS' => '&#x20b5;',
				'GIP' => '&pound;',
				'GMD' => 'D',
				'GNF' => 'Fr',
				'GTQ' => 'Q',
				'GYD' => '&#36;',
				'HKD' => '&#36;',
				'HNL' => 'L',
				'HRK' => 'kn',
				'HTG' => 'G',
				'HUF' => '&#70;&#116;',
				'IDR' => 'Rp',
				'ILS' => '&#8362;',
				'IMP' => '&pound;',
				'INR' => '&#8377;',
				'IQD' => '&#x639;.&#x62f;',
				'IRR' => '&#xfdfc;',
				'IRT' => '&#x062A;&#x0648;&#x0645;&#x0627;&#x0646;',
				'ISK' => 'kr.',
				'JEP' => '&pound;',
				'JMD' => '&#36;',
				'JOD' => '&#x62f;.&#x627;',
				'JPY' => '&yen;',
				'KES' => 'KSh',
				'KGS' => '&#x441;&#x43e;&#x43c;',
				'KHR' => '&#x17db;',
				'KMF' => 'Fr',
				'KPW' => '&#x20a9;',
				'KRW' => '&#8361;',
				'KWD' => '&#x62f;.&#x643;',
				'KYD' => '&#36;',
				'KZT' => '&#8376;',
				'LAK' => '&#8365;',
				'LBP' => '&#x644;.&#x644;',
				'LKR' => '&#xdbb;&#xdd4;',
				'LRD' => '&#36;',
				'LSL' => 'L',
				'LYD' => '&#x644;.&#x62f;',
				'MAD' => '&#x62f;.&#x645;.',
				'MDL' => 'MDL',
				'MGA' => 'Ar',
				'MKD' => '&#x434;&#x435;&#x43d;',
				'MMK' => 'Ks',
				'MNT' => '&#x20ae;',
				'MOP' => 'P',
				'MRU' => 'UM',
				'MUR' => '&#x20a8;',
				'MVR' => '.&#x783;',
				'MWK' => 'MK',
				'MXN' => '&#36;',
				'MYR' => '&#82;&#77;',
				'MZN' => 'MT',
				'NAD' => 'N&#36;',
				'NGN' => '&#8358;',
				'NIO' => 'C&#36;',
				'NOK' => '&#107;&#114;',
				'NPR' => '&#8360;',
				'NZD' => '&#36;',
				'OMR' => '&#x631;.&#x639;.',
				'PAB' => 'B/.',
				'PEN' => 'S/',
				'PGK' => 'K',
				'PHP' => '&#8369;',
				'PKR' => '&#8360;',
				'PLN' => '&#122;&#322;',
				'PRB' => '&#x440;.',
				'PYG' => '&#8370;',
				'QAR' => '&#x631;.&#x642;',
				'RMB' => '&yen;',
				'RON' => 'lei',
				'RSD' => '&#1088;&#1089;&#1076;',
				'RUB' => '&#8381;',
				'RWF' => 'Fr',
				'SAR' => '&#x631;.&#x633;',
				'SBD' => '&#36;',
				'SCR' => '&#x20a8;',
				'SDG' => '&#x62c;.&#x633;.',
				'SEK' => '&#107;&#114;',
				'SGD' => '&#36;',
				'SHP' => '&pound;',
				'SLL' => 'Le',
				'SOS' => 'Sh',
				'SRD' => '&#36;',
				'SSP' => '&pound;',
				'STN' => 'Db',
				'SYP' => '&#x644;.&#x633;',
				'SZL' => 'L',
				'THB' => '&#3647;',
				'TJS' => '&#x405;&#x41c;',
				'TMT' => 'm',
				'TND' => '&#x62f;.&#x62a;',
				'TOP' => 'T&#36;',
				'TRY' => '&#8378;',
				'TTD' => '&#36;',
				'TWD' => '&#78;&#84;&#36;',
				'TZS' => 'Sh',
				'UAH' => '&#8372;',
				'UGX' => 'UGX',
				'USD' => '&#36;',
				'UYU' => '&#36;',
				'UZS' => 'UZS',
				'VEF' => 'Bs F',
				'VES' => 'Bs.S',
				'VND' => '&#8363;',
				'VUV' => 'Vt',
				'WST' => 'T',
				'XAF' => 'CFA',
				'XCD' => '&#36;',
				'XOF' => 'CFA',
				'XPF' => 'Fr',
				'YER' => '&#xfdfc;',
				'ZAR' => '&#82;',
				'ZMW' => 'ZK',
			)
		);
		return $symbols[ $key ] ?? '&#36;';
	}

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
			$fmt = new \NumberFormatter( get_locale(), \NumberFormatter::CURRENCY );
			return $fmt->formatCurrency( self::formatCurrencyNumber( $amount ), $currency_code );
		}

		return self::getCurrencySymbol( $currency_code ) . self::formatCurrencyNumber( $amount );
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
			'aud' => __( 'Australia Dollars', 'surecart' ),
			'brl' => __( 'Brazilian Real', 'surecart' ),
			'cad' => __( 'Canadian Dollars', 'surecart' ),
			'cny' => __( 'Chinese Yuan', 'surecart' ),
			'czk' => __( 'Czech Koruna', 'surecart' ),
			'dkk' => __( 'Danish Krone', 'surecart' ),
			'eur' => __( 'Euros', 'surecart' ),
			'hkd' => __( 'Hong Kong Dollar', 'surecart' ),
			'huf' => __( 'Hungarian Forint', 'surecart' ),
			'inr' => __( 'Indian Rupee', 'surecart' ),
			'idr' => __( 'Indonesia Rupiah', 'surecart' ),
			'ils' => __( 'Israeli Shekel', 'surecart' ),
			'jpy' => __( 'Japanese Yen', 'surecart' ),
			'mxn' => __( 'Mexican Peso', 'surecart' ),
			'nzd' => __( 'New Zealand Dollar', 'surecart' ),
			'nok' => __( 'Norwegian Krone', 'surecart' ),
			'php' => __( 'Philippine Pesos', 'surecart' ),
			'pln' => __( 'Polish Zloty', 'surecart' ),
			'gbp' => __( 'Pounds Sterling', 'surecart' ),
			'sgd' => __( 'Singapore Dollar', 'surecart' ),
			'zar' => __( 'South African Rand', 'surecart' ),
			'krw' => __( 'South Korean Won', 'surecart' ),
			'sek' => __( 'Swedish Krona', 'surecart' ),
			'chf' => __( 'Swiss Franc', 'surecart' ),
			'twd' => __( 'Taiwan New Dollars', 'surecart' ),
			'thb' => __( 'Thai Baht', 'surecart' ),
			'try' => __( 'Turkish Lira', 'surecart' ),
			'usd' => __( 'US Dollars', 'surecart' ),
			'vnd' => __( 'Vietnamese Dong', 'surecart' ),
		];
	}
}
