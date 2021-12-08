<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class CustomerDashboardButton extends Block {

	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-dashboard-button';

	/**
	 * Register the block for dynamic output
	 *
	 * @param \Pimple\Container $container Service container.
	 *
	 * @return void
	 */
	public function register( $container ) {
		$this->container = $container;

		register_block_type(
			'checkout-engine/customer-dashboard-button',
			[
				'apiVersion'      => 2,
				'name'            => 'checkout-engine/buy-button',
				'title'           => __( 'Customer Dashboard Button', 'checkout_engine' ),
				'description'     => __( 'Display a button to direct the user to their dashboard page.', 'checkout_engine' ),
				'category'        => 'layout',
				'keywords'        => [ 'dashboard', 'customer', 'button' ],
				'supports'        => [
					'reusable' => false,
					'html'     => false,
				],
				'attributes'      => [
					'label'     => [
						'type'    => 'string',
						'default' => __( 'Customer Dashboard', 'checkout_engine' ),
					],
					'type'      => [
						'type'    => 'string',
						'default' => 'primary',
					],
					'size'      => [
						'type'    => 'string',
						'default' => 'medium',
					],
					'show_icon' => [
						'type'    => 'boolean',
						'defalut' => true,
					],
				],
				'render_callback' => [ $this, 'render' ],
			]
		);
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
			[
				'type'      => $attributes['type'] ?? 'primary',
				'show_icon' => (bool) $attributes['show_icon'],
				'size'      => $attributes['size'] ?? 'medium',
				'href'      => \CheckoutEngine::pages()->url( 'dashboard' ),
				'label'     => $attributes['label'] ?? __( 'Your Dashboard', 'checkout_session' ),
			]
		);
	}
}
