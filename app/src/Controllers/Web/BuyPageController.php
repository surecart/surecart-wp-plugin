<?php
namespace SureCart\Controllers\Web;

/**
 * Handles webhooks
 */
class BuyPageController {
	/**
	 * Product.
	 *
	 * @var \SureCart\Models\Product
	 */
	protected $product;

	/**
	 * Preload these blocks.
	 *
	 * @var array
	 */
	protected $preload = [
		'surecart/column',
		'surecart/columns',
		'surecart/coupon',
		'surecart/name',
		'surecart/email',
		'surecart/address',
		'surecart/totals',
		'surecart/total',
		'surecart/submit',
		'surecart/price-selector',
		'surecart/price-choice',
		'surecart/payment',
	];

	/**
	 * Handle filters.
	 *
	 * @return void
	 */
	public function filters() {
		// it's not a 404 page.
		global $wp_query;
		$wp_query->is_404 = false;

		// set the canonical url.
		add_filter( 'get_canonical_url', [ $this, 'maybeSetUrl' ] );
		// set the shortlink.
		add_filter( 'get_shortlink', [ $this, 'maybeSetUrl' ] );
		// set the post link.
		add_filter( 'post_link', [ $this, 'maybeSetUrl' ] );
		// set the document title.
		add_filter( 'document_title_parts', [ $this, 'documentTitle' ] );
		// disallow pre title filter.
		add_filter( 'pre_get_document_title', [ $this, 'disallowPreTitle' ], 214748364 );
		// add edit product link.
		add_action( 'admin_bar_menu', [ $this, 'addEditProductLink' ], 99 );
		// do not persist the cart for this page.
		add_filter( 'surecart-components/scData', [ $this, 'doNotPersistCart' ], 10, 2 );
		// add styles.
		add_action( 'wp_enqueue_scripts', [ $this, 'styles' ] );
		// add scripts.
		add_action( 'wp_enqueue_scripts', [ $this, 'scripts' ] );
	}

	/**
	 * Preload components.
	 *
	 * @return void
	 */
	public function preloadComponents() {
		$config = \SureCart::resolve( SURECART_CONFIG_KEY );
		foreach ( $this->preload as $name ) {
			\SureCart::preload()->add( $config['preload'][ $name ] );
		}
	}

	/**
	 * Add edit links
	 *
	 * @param \WP_Admin_bar $wp_admin_bar The admin bar.
	 *
	 * @return void
	 */
	public function addEditProductLink( $wp_admin_bar ) {
		if ( empty( $this->product->id ) ) {
			return;
		}
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => esc_url( \SureCart::getUrl()->edit( 'product', $this->product->id ) ),
			]
		);
	}

	/**
	 * Show the product page
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @param \SureCartCore\View                      $view View.
	 * @param string                                  $id The id of the product.
	 * @return function
	 */
	public function show( $request, $view, $id ) {
		// fetch the product by id/slug.
		$this->product = \SureCart\Models\Product::with( [ 'image', 'prices' ] )->find( $id );
		if ( is_wp_error( $this->product ) ) {
			return $this->handleError( $this->product );
		}

		// if this buy page is not enabled, check read permissions.
		if ( ! $this->product->buyLink()->isEnabled() && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $this->product->slug !== $id ) {
			return \SureCart::redirect()->to( esc_url_raw( \SureCart::routeUrl( 'product', [ 'id' => $this->product->slug ] ) ) );
		}

		// get active prices.
		$active_prices = $this->product->activePrices();

		// must have at least one active price.
		if ( empty( $active_prices[0] ) ) {
			return $this->notFound();
		}

		// prevent 404 redirects by 3rd party plugins.
		$_SERVER['REQUEST_URI'] = $request->getUrl();

		// add the filters.
		$this->filters();

		// preload the components.
		$this->preloadComponents();

		// render the view.
		return \SureCart::view( 'web/buy' )->with(
			[
				'product'          => $this->product,
				'prices'           => $active_prices,
				'selected_price'   => $active_prices[0] ?? null,
				'terms_text'       => $this->termsText(),
				'mode'             => $this->product->buyLink()->getMode(),
				'store_name'       => \SureCart::account()->name ?? get_bloginfo(),
				'logo_url'         => \SureCart::account()->brand->logo_url,
				'logo_width'       => \SureCart::settings()->get( 'buy_link_logo_width', '180px' ),
				'user'             => wp_get_current_user(),
				'logout_link'      => wp_logout_url( $request->getUrl() ),
				'dashboard_link'   => \SureCart::pages()->url( 'dashboard' ),
				'enabled'          => $this->product->buyLink()->isEnabled(),
				'show_logo'        => $this->product->buyLink()->templatePartEnabled( 'logo' ),
				'show_terms'       => $this->product->buyLink()->templatePartEnabled( 'terms' ),
				'show_image'       => $this->product->buyLink()->templatePartEnabled( 'image' ),
				'show_description' => $this->product->buyLink()->templatePartEnabled( 'description' ),
				'show_coupon'      => $this->product->buyLink()->templatePartEnabled( 'coupon' ),
			]
		);
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function styles() {
		wp_enqueue_style(
			'surecart/instant-checkout',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/templates/instant-checkout.css',
			[],
			filemtime( trailingslashit( plugin_dir_path( SURECART_PLUGIN_FILE ) ) . 'dist/templates/instant-checkout.css' ),
		);
	}


	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function scripts() {
		\SureCart::assets()->enqueueComponents();
	}

	/**
	 * Generate the terms html.
	 *
	 * @return string
	 */
	public function termsText() {
		$terms_url   = \SureCart::account()->portal_protocol->terms_url;
		$privacy_url = \SureCart::account()->portal_protocol->privacy_url;

		if ( ! empty( $terms_url ) && ! empty( $privacy_url ) ) {
			return sprintf(
				// translators: %1$1s is the store name, %2$2s is the opening anchor tag, %3$3s is the closing anchor tag, %4$4s is the opening anchor tag, %5$5s is the closing anchor tag.
				__( "I agree to %1$1s's %2$2sTerms%3$3s and %4$4sPrivacy Policy%5$5s", 'Surecart' ),
				esc_html( \SureCart::account()->name ),
				'<a href="' . esc_url( $terms_url ) . '" target="_blank">',
				'</a>',
				'<a href="' . esc_url( $privacy_url ) . '" target="_blank">',
				'</a>'
			);
		}

		if ( $terms_url ) {
			return sprintf(
				// translators: %1$1s is the store name, %2$2s is the opening anchor tag, %3$3s is the closing anchor tag.
				__( "I agree to %1$1s's %2$2sTerms%3$3s", 'Surecart' ),
				esc_html( \SureCart::account()->name ),
				'<a href="' . esc_url( $terms_url ) . '" target="_blank">',
				'</a>'
			);
		}

		if ( $privacy_url ) {
			return sprintf(
				// translators: %1$1s is the store name, %2$2s is the opening anchor tag, %3$3s is the closing anchor tag.
				__( "I agree to %1$1s's %2$2sPrivacy Policy%3$3s", 'Surecart' ),
				esc_html( \SureCart::account()->name ),
				'<a href="' . esc_url( $privacy_url ) . '" target="_blank">',
				'</a>'
			);
		}

		return '';
	}

	/**
	 * Do not persist the cart on the buy page.
	 *
	 * @param array $data ScData array.
	 *
	 * @return array
	 */
	public function doNotPersistCart( $data ) {
		$data['do_not_persist_cart'] = true;
		return $data;
	}

	/**
	 * Maybe set the url if needed.
	 *
	 * @param string $url The url.
	 *
	 * @return string
	 */
	public function maybeSetUrl( $url ) {
		if ( empty( $this->product->id ) ) {
			return $url;
		}
		return \SureCart::routeUrl( 'buy', [ 'id' => $this->product->id ] );
	}

	/**
	 * Update the document title name to match the product name.
	 *
	 * @param array $parts The parts of the document title.
	 */
	public function documentTitle( $parts ) {
		$parts['title'] = $this->product->name ?? $parts['title'];
		return $parts;
	}

	/**
	 * Disallow the pre title.
	 *
	 * @param string $title The title.
	 *
	 * @return string
	 */
	public function disallowPreTitle( $title ) {
		if ( ! empty( $this->product->id ) ) {
			return '';
		}
		return $title;
	}

	/**
	 * Handle fetching error.
	 *
	 * @param \WP_Error $wp_error The error.
	 *
	 * @return void|function
	 */
	public function handleError( \WP_Error $wp_error ) {
		$data = (array) $wp_error->get_error_data();
		if ( 404 === ( $data['status'] ?? null ) ) {
			return $this->notFound();
		}
		wp_die( esc_html( implode( ' ', $wp_error->get_error_messages() ) ) );
	}

	/**
	 * Handle not found error.
	 *
	 * @return void
	 */
	public function notFound() {
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		get_template_part( 404 );
		exit();
	}
}
