<?php

namespace SureCart\WordPress;

use SureCart\Support\Currency;

/**
 * Currency Service
 */
class CurrencyService {
	/**
	 * Bootstrap the currency service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Filter URLs.
		add_filter( 'page_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'post_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'term_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'post_type_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'attachment_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'home_url', array( $this, 'addCurrencyParamToHomeUrl' ), 99, 3 );

		// Remove the currency parameter from the canonical permalink.
		add_filter( 'get_canonical_url', array( $this, 'removeCurrencyParam' ) );
	}

	/**
	 * Filter the link to add the currency parameter.
	 *
	 * @param string $permalink The permalink to filter.
	 *
	 * @return string The filtered permalink.
	 */
	public function addCurrencyParam( $permalink ) {
		if ( apply_filters( 'surecart/currency/filter_url', true, $permalink ) ) {
			$currency = Currency::getCurrentCurrency();
			if ( ! empty( $currency ) && strtolower( $currency ) !== strtolower( \SureCart::account()->currency ) ) {
				$permalink = add_query_arg( compact( 'currency' ), $permalink );
			}
		}

		return $permalink;
	}

	/**
	 * Filter Home URL
	 *
	 * @param string $url    Url.
	 * @param string $path   Path.
	 * @param string $scheme Scheme.
	 *
	 * @return string
	 */
	public function addCurrencyParamToHomeUrl( $url, $path, $scheme ) {
		if ( 'rest' !== $scheme ) {
			$url = $this->addCurrencyParam( $url );
		}

		return $url;
	}

	/**
	 * Remove the currency parameter from the canonical permalink.
	 *
	 * @param string $permalink The permalink to filter.
	 *
	 * @return string The filtered permalink.
	 */
	public function removeCurrencyParam( $permalink ) {
		return remove_query_arg( 'currency', $permalink );
	}
}
