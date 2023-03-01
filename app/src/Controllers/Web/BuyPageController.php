<?php
namespace SureCart\Controllers\Web;

use SureCart\Models\ManualPaymentMethod;
use SureCart\Models\Processor;

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
	 * Holds the config.
	 *
	 * @var array
	 */
	protected $config;

	/**
	 * Instantiate the config.
	 */
	public function __construct() {
		 $this->config = \SureCart::resolve( SURECART_CONFIG_KEY );
	}

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
		// add edit product link.
		add_action( 'admin_bar_menu', [ $this, 'addEditProductLink' ], 99 );
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
		$this->product = \SureCart\Models\Product::with( [ 'prices', 'image' ] )->find( $id );
		if ( is_wp_error( $this->product ) ) {
			return $this->handleError( $this->product );
		}

		$enabled = ! empty( $this->product->metadata->wp_buy_link_enabled ) ? 'true' === $this->product->metadata->wp_buy_link_enabled : false;
		// if this product is a draft, check read permissions.
		if ( ! $enabled && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $this->product->slug !== $id ) {
			return \SureCart::redirect()->to( esc_url_raw( \SureCart::routeUrl( 'product', [ 'id' => $this->product->slug ] ) ) );
		}

		$this->filters();

		foreach ( $this->preload as $name ) {
			\SureCart::preload()->add( $this->config['preload'][ $name ] );
		}

		return \SureCart::view( 'web/buy' )->with(
			[
				'product'          => $this->product,
				'mode'             => 'true' === ( $this->product->metadata->wp_buy_link_test_mode_enabled ?? '' ) ? 'test' : 'live',
				'show_image'       => 'true' !== ( $this->product->metadata->wp_buy_link_product_image_disabled ?? '' ),
				'show_description' => 'true' !== ( $this->product->metadata->wp_buy_link_product_description_disabled ?? '' ),
				'show_coupon'      => 'true' !== ( $this->product->metadata->wp_buy_link_coupon_field_disabled ?? '' ),
			]
		);
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
	 * Handle fetching error.
	 *
	 * @param \WP_Error $wp_error
	 *
	 * @return void
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
