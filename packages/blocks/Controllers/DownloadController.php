<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Component;
use SureCart\Models\PortalSession;
use SureCart\Models\Purchase;
use SureCart\Models\User;

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
			Component::tag( 'sc-dashboard-downloads-list' )
			->id( 'customer-downloads-preview' )
			->with(
				[
					'allLink'      => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'download',
							'action' => 'index',
						],
						\SureCart::pages()->url( 'dashboard' )
					),
					'requestNonce' => wp_create_nonce( 'customer-download' ),
					'query'        => [
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
			Component::tag( 'sc-orders-list' )
			->id( 'customer-orders-index' )
			->with(
				[
					'heading' => __( 'Order History', 'surecart' ),

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

	public function edit() {
		if ( ! wp_verify_nonce( $_GET['nonce'], 'customer-download' ) ) {
			die( __( 'Your session expired. Please go back and try again.', 'surecart' ) );
		}

		if ( ! User::current()->isCustomer() ) {
			return;
		}

		$id = $this->getId();

		if ( ! $id ) {
			return $this->notFound();
		}

		$purchase = Purchase::find( $id );

		$session = PortalSession::create(
			[
				'public'     => true,
				'return_url' => add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) ),
				'customer'   => $purchase->customer,
			]
		);

		$url = (object) parse_url( $session->url );

		if ( $session->url ) {
			wp_redirect( esc_url_raw( "{$url->scheme}://{$url->host}{$url->path}/purchases/$purchase->id?portal_session_id=$session->id" ) );
			exit;
		}

		return $this->notFound();
	}
}
