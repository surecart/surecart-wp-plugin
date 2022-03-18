<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerDownloads;

use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;
use CheckoutEngineBlocks\Controllers\DownloadController;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the preview (overview)
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
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
					'nonce'   => wp_create_nonce( 'customer-download' ),
					'query'   => [
						'order_ids' => array_values( User::current()->customerIds() ),
						'page'      => 1,
						'per_page'  => 10,
					],
				]
			)->render( $attributes['title'] ? "<span slot='heading'>" . $attributes['title'] . '</span>' : '' )
	}
}
