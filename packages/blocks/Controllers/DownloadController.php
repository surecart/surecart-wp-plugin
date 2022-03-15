<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\User;

/**
 * The subscription controller.
 */
class DownloadController extends BaseController {
	/**
	 * Preview.
	 *
	 * @param array $attributes Block attributes.
	 */
	public function preview( $attributes = [] ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-downloads-list' )
			->id( 'customer-downloads-preview' )
			->with(
				[
					'allLink' => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'download',
							'action' => 'index',
						],
						\CheckoutEngine::pages()->url( 'dashboard' )
					),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'page'         => 1,
						'per_page'     => 10,
					],
				]
			)->render( $attributes['title'] ? "<span slot='heading'>" . $attributes['title'] . '</span>' : '' )
		);
	}

	/**
	 * Index.
	 */
	public function index() {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-orders-list' )
			->id( 'customer-orders-index' )
			->with(
				[
					'heading' => __( 'Order History', 'checkout-engine' ),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'status'       => [ 'paid' ],
						'page'         => 1,
						'per_page'     => 10,
					],
				]
			)->render()
		);
	}
}
