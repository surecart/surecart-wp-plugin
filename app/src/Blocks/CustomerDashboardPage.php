<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Controllers\Web\Dashboard\CustomerCheckoutSessionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerSubscriptionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerChargesController;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
class CustomerDashboardPage extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'dashboard-page';

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [
		'id'    => [
			'type' => 'string',
		],
		'name'  => [
			'type' => 'string',
		],
		'title' => [
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
		// get the current page tab and possible id.
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;

		// make sure we are on the correct tab.
		if ( empty( $attributes['name'] ) || $tab !== $attributes['name'] ) {
			return '';
		}

		return '<ce-spacing style="--spacing: var(--ce-spacing-large)">' . wp_kses_post( $content ) . '</ce-spacing>';
	}
}
