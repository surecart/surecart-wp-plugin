<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Controllers\Web\Dashboard\CustomerCheckoutSessionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerSubscriptionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerChargesController;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
class CustomerDashboardTab extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'dashboard-tab';

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [
		'id'       => [
			'type' => 'string',
		],
		'panel'    => [
			'type' => 'string',
		],
		'title'    => [
			'type' => 'string',
		],
		'icon'     => [
			'type' => 'string',
		],
		'icon_svg' => [
			'type' => 'string',
		],
	];

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return void
	 */
	public function render( $attributes, $content ) {
		// we need a panel name.
		if ( empty( $attributes['panel'] ) ) {
			return;
		}

		// get the current page tab and possible id.
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : 'orders';

		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
			[
				'active' => $tab === $attributes['panel'] ? 'true' : 'false',
				'title'  => $attributes['title'] ?? '',
				'icon'   => $attributes['icon'] ?? 'home',
				'href'   => esc_url( remove_query_arg( 'id', add_query_arg( [ 'tab' => $attributes['panel'] ] ) ) ),
			]
		);
	}
}
