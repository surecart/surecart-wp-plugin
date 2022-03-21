<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Component;
use SureCart\Models\User;

/**
 * The subscription controller.
 */
class InvoiceController extends BaseController {
	/**
	 * Preview.
	 */
	public function preview( $attributes = [] ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		return wp_kses_post(
			Component::tag( 'ce-invoices-list' )
			->id( 'customer-invoices-preview' )
			->with(
				[
					'heading' => $attributes['title'] ?? __( 'Invoice History', 'surecart' ),
					'allLink' => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'invoice',
							'action' => 'index',
						],
						\SureCart::pages()->url( 'dashboard' )
					),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'status'       => [ 'paid' ],
						'page'         => 1,
						'per_page'     => 5,
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
			Component::tag( 'ce-invoices-list' )
			->id( 'customer-invoices-index' )
			->with(
				[
					'heading' => __( 'Invoice History', 'surecart' ),
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
