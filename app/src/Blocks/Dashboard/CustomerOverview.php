<?php

namespace CheckoutEngine\Blocks\Dashboard;

use CheckoutEngine\Blocks\Dashboard\Support\DashboardPage;

/**
 * Checkout block
 */
class CustomerOverview extends DashboardPage {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-overview';

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		return \CheckoutEngine::blocks()->render(
			'web.dashboard.overview.show',
			[
				'customer_id' => $this->customer->id,
			]
		);
	}
}
