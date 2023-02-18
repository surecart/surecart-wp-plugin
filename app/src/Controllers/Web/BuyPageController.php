<?php
namespace SureCart\Controllers\Web;

use SureCart\Models\ManualPaymentMethod;
use SureCart\Models\Processor;

/**
 * Handles webhooks
 */
class BuyPageController {
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
		$product = \SureCart\Models\Product::with( [ 'prices', 'image' ] )->find( $id );
		if ( is_wp_error( $product ) ) {
			return $this->handleError( $product );
		}

		// if this product is a draft, check read permissions.
		if ( 'draft' === $product->status && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $product->slug !== $id ) {
			return \SureCart::redirect()->to( esc_url_raw( \SureCart::routeUrl( 'product', [ 'id' => $product->slug ] ) ) );
		}

		$user = wp_get_current_user();

		$processors = Processor::get();
		if ( is_wp_error( $processors ) ) {
			$processors = [];
		}
		$processors = array_values(
			array_filter(
				$processors ?? [],
				function( $processor ) {
					return $processor->approved && $processor->enabled;
				}
			)
		);

		return \SureCart::view( 'web/buy' )->with(
			[
				'product'                       => $product,
				'font_size'                     => 16,
				'customer'                      => [
					'email' => $user->user_email,
					'name'  => $user->display_name,
				],
				'honeypot_enabled'              => (bool) get_option( 'surecart_honeypot_enabled', true ),
				'currency_code'                 => $attributes['currency'] ?? \SureCart::account()->currency,
				'tax_protocol'                  => \SureCart::account()->tax_protocol,
				'abandoned_checkout_return_url' => esc_url( trailingslashit( get_site_url() ) . 'surecart/redirect' ),
				'processors'                    => (array) $processors,
				'manual_payment_methods'        => (array) ManualPaymentMethod::where( [ 'archived' => false ] )->get() ?? [],
				'stripe_payment_element'        => (bool) get_option( 'sc_stripe_payment_element', false ),
				'mode'                          => apply_filters( 'surecart/payments/mode', $attributes['mode'] ?? 'live' ),
				'form_id'                       => $product->id,
				'id'                            => 'sc-checkout-' . $product->id,
				'prices'                        => $product->prices->data ?? [],
				'loading_text'                  => [],
				'success_url'                   => ! empty( $attributes['success_url'] ) ? $attributes['success_url'] : \SureCart::pages()->url( 'order-confirmation' ),
			]
		);
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
