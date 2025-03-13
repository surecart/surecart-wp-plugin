<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * DisplayCurrency model.
 */
class DisplayCurrency extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'display_currencies';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'display_currency';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'display_currencies';

	/**
	 * Get the display example attribute
	 *
	 * @return string
	 */
	protected function getDisplayExampleAttribute() {
		return Currency::format( 123456, $this->currency );
	}

	/**
	 * Get the name of the currency.
	 *
	 * @return string
	 */
	protected function getNameAttribute() {
		return Currency::getName( $this->currency );
	}

	/**
	 * Get the currency symbol.
	 *
	 * @return string
	 */
	protected function getCurrencySymbolAttribute() {
		return html_entity_decode( Currency::getCurrencySymbol( $this->currency ) );
	}

	/**
	 * Is this the default store currency?
	 *
	 * @return boolean
	 */
	protected function getIsDefaultCurrencyAttribute() {
		return \SureCart::account()->currency === $this->currency;
	}

	/**
	 * Get the flag URL.
	 *
	 * @return string
	 */
	protected function getFlagAttribute() {
		return file_exists( dirname( SURECART_PLUGIN_FILE ) . '/images/flags/' . strtolower( $this->currency ) . '.svg' )
			? plugins_url( 'images/flags/' . strtolower( $this->currency ) . '.svg', SURECART_PLUGIN_FILE )
			: null;
	}
}
