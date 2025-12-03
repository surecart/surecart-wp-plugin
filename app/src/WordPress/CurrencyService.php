<?php

namespace SureCart\WordPress;

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
	 * Filter URLs
	 *
	 * @var bool
	 */
	private static $filter_url = true;

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
		add_filter( 'page_link', array( $this, 'maybeAddCurrencyParam' ), 99 );
		add_filter( 'post_link', array( $this, 'maybeAddCurrencyParam' ), 99 );
		add_filter( 'term_link', array( $this, 'maybeAddCurrencyParam' ), 99 );
		add_filter( 'post_type_link', array( $this, 'maybeAddCurrencyParam' ), 99 );
		add_filter( 'attachment_link', array( $this, 'maybeAddCurrencyParam' ), 99 );
		add_filter( 'home_url', array( $this, 'addCurrencyParamToHomeUrl' ), 99, 3 );
		add_filter( 'get_canonical_url', array( $this, 'removeCurrencyParam' ) );
		add_filter( 'get_pagenum_link', array( $this, 'filterPagenumLink' ), 99, 2 );
	}

	/**
	 * Filter paginate link
	 *
	 * @param string $result  The page number link.
	 * @param int    $pagenum The page number.
	 *
	 * @return string
	 */
	public function filterPagenumLink( $result, $pagenum ) {
		if ( self::$filter_url ) {
			remove_filter( 'get_pagenum_link', array( $this, 'filterPagenumLink' ), 99 );
			self::$filter_url = false;
			$result           = get_pagenum_link( $pagenum, false );
			add_filter( 'get_pagenum_link', array( $this, 'filterPagenumLink' ), 99, 2 );
			self::$filter_url = true;
		}

		return $result;
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
	 * Maybe Filter the link to add the currency parameter.
	 *
	 * @param string $permalink The permalink to filter.
	 *
	 * @return string The permalink or the filtered permalink.
	 */
	public function maybeAddCurrencyParam( $permalink ) {
		if ( ! $this->shouldModifyUrl() ) {
			return $permalink;
		}

		return $this->addCurrencyParam( $permalink );
	}

	/**
	 * Filter the link to add the currency parameter.
	 *
	 * @param string $permalink The permalink to filter.
	 *
	 * @return string The filtered permalink.
	 */
	public function addCurrencyParam( $permalink ) {
		if ( apply_filters( 'surecart/currency/filter_url', self::$filter_url, $permalink ) && ! $this->isSitemapOrFeedRequest() ) {
			// we can't use the Currency::getCurrencyFromRequest here because we don't want to fetch display currencies potentially multiple times per request.
			$currency = strtolower( sanitize_text_field( $_GET['currency'] ?? $_COOKIE['sc_current_currency'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( ! empty( $currency ) && strtolower( $currency ) !== strtolower( \SureCart::account()->currency ?? '' ) ) {
				$permalink = add_query_arg( compact( 'currency' ), $permalink );
			}
		}

		return $permalink;
	}

	/**
	 * Check if the request is an XML request.
	 *
	 * @return bool
	 */
	private function isSitemapOrFeedRequest(): bool {
		global $wp;

		if ( is_feed() || is_robots() || wp_is_xml_request() ) {
			return true;
		}

		// Don't filter XML requests.
		if ( ! empty( $wp->request ) && preg_match( '/\.xml$/', $wp->request ) ) {
			return true;
		}

		// In case of a custom XML request.
		if ( ! empty( $_SERVER['REQUEST_URI'] ) && str_contains( $_SERVER['REQUEST_URI'], '.xml' ) ) {
			return true;
		}

		return false;
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
		if ( ! $this->shouldModifyUrl( $path, $scheme ) ) {
			return $url;
		}

		return $this->addCurrencyParam( $url );
	}

	/**
	 * Determines if the URL should be modified with currency parameter.
	 *
	 * @param string $path   Optional. The path for home_url. Default empty string.
	 * @param string $scheme Optional. The scheme for requests. Default empty string.
	 *
	 * @return bool Whether the URL should be modified.
	 */
	protected function shouldModifyUrl( $path = '', $scheme = '' ) {
		// Return false if any of these conditions are true (don't modify URL).
		return empty( $path ) &&
			! is_admin() &&
			! ( defined( 'REST_REQUEST' ) && REST_REQUEST ) &&
			! wp_doing_ajax() &&
			! $this->isSitemapOrFeedRequest() &&
			'rest' !== $scheme;
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
