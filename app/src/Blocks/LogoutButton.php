<?php

namespace CheckoutEngine\Blocks;

/**
 * Checkout block
 */
class LogoutButton extends Block {

	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'logout-button';

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
			'checkout-engine/logout-button',
			[
				'apiVersion'      => 2,
				'name'            => 'checkout-engine/logout-button',
				'title'           => __( 'Logout Button', 'checkout_engine' ),
				'description'     => __( 'Display a button to immediately redirect to the checkout page with the product in the cart.', 'checkout_engine' ),
				'category'        => 'layout',
				'keywords'        => [ 'logout', 'signout', 'sign', 'log' ],
				'supports'        => [
					'reusable' => false,
					'html'     => false,
				],
				'attributes'      => [
					'label'             => [
						'type' => 'string',
					],
					'type'              => [
						'type'    => 'string',
						'default' => 'primary',
					],
					'size'              => [
						'type'    => 'string',
						'default' => 'medium',
					],
					'show_icon'         => [
						'type'    => 'boolean',
						'default' => false,
					],
					'redirectToCurrent' => [
						'type'    => 'boolean',
						'default' => false,
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
		if ( ! is_user_logged_in() ) {
			return;
		}

		// Build the redirect URL.
		$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

		return \CheckoutEngine::blocks()->render(
			"blocks/$this->name",
			[
				'href'      => esc_url( wp_logout_url( $attributes['redirectToCurrent'] ? $current_url : '' ) ),
				'type'      => $attributes['type'] ?? 'primary',
				'size'      => $attributes['size'] ?? 'medium',
				'show_icon' => $attributes['show_icon'] ?? false,
				'label'     => $attributes['label'] ?? __( 'Logout', 'checkout_session' ),
			]
		);
	}
}
