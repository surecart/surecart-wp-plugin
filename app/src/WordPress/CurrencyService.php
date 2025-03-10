<?php

namespace SureCart\WordPress;

use SureCart\Support\Currency;

/**
 * Currency Service
 */
class CurrencyService {

	/**
	 * Should convert currency?
	 *
	 * @var bool
	 */
	public $is_converting = false;

	/**
	 * Bootstrap the currency service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Set the currency cookie.
		add_action( 'plugins_loaded', array( $this, 'setCurrencyCookie' ) );

		// add the currency switcher menu.
		add_filter( 'wp_nav_menu_items', array( $this, 'addCurrencySwitcherMenu' ), 10, 2 );

		// set the urls.
		add_action( 'init', [ $this, 'appendUrls' ] );
	}

	/**
	 * Initialize the currency service.
	 *
	 * @return void
	 */
	public function appendUrls() {
		add_filter( 'page_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'post_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'term_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'post_type_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'attachment_link', array( $this, 'addCurrencyParam' ), 99 );
		add_filter( 'home_url', array( $this, 'addCurrencyParamToHomeUrl' ), 99, 3 );
		add_filter( 'get_canonical_url', array( $this, 'removeCurrencyParam' ) );
	}

	/**
	 * Set the currency cookie.
	 *
	 * @return void
	 */
	public function setCurrencyCookie() {
		if ( isset( $_GET['currency'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			sc_setcookie( 'sc_current_currency', $_GET['currency'], time() + 7 * DAY_IN_SECONDS ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
	}

	/**
	 * Add the currency switcher menu.
	 *
	 * @param string $items The menu items.
	 * @param object $args The menu arguments.
	 *
	 * @return string The menu items.
	 */
	public function addCurrencySwitcherMenu( $items, $args ) {
		$menu = wp_get_nav_menu_object( $args->menu );
		$id   = $menu ? $menu->term_id : false;

		$currency_switcher_selected_ids = get_option( 'surecart_currency_switcher_selected_ids', [] );

		// if we don't have a menu id, or it's not in the selected ids, bail.
		if ( empty( $id ) || ! in_array( $id, $currency_switcher_selected_ids, true ) ) {
			return $items;
		}

		$cart_menu_alignment = (string) get_option( 'surecart_currency_switcher_alignment', 'right' );

		$menu = '<li class="menu-item"><div class="menu-link">' . do_blocks(
			'<!-- wp:surecart/currency-switcher ' . wp_json_encode(
				apply_filters(
					'surecart/currency/switcher_attributes',
					[
						'position' => 'right' === $cart_menu_alignment ? 'right' : 'left',
					]
				)
			) . ' /-->'
		) . '</div></li>';

		// left or right.
		$items = 'right' === $cart_menu_alignment ? $items . $menu : $menu . $items;

		return $items;
	}
	/**
	 * Convert currency.
	 *
	 * @param bool $convert Convert.
	 *
	 * @return void
	 */
	public function convert( $convert = true ) {
		$this->is_converting = $convert;
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
			// we can't use the Currency::getCurrencyFromRequest here because we don't want to fetch display currencies potentially multiple times per request.
			$currency = strtolower( sanitize_text_field( $_GET['currency'] ?? $_COOKIE['sc_current_currency'] ?? null ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
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
		if ( 'rest' !== $scheme && ! is_admin() ) {
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
