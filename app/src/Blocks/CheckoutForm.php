<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Concerns\HasBlockTheme;

/**
 * Checkout block
 */
class CheckoutForm extends Block {
	use HasblockTheme;

	/**
	 * Keep track of checkout form instances
	 * on the page with an id.
	 *
	 * @var integer
	 */
	private static $instance = 1;

	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'checkout-form';

	/**
	 * Register the block for dynamic output
	 *
	 * @param \Pimple\Container $container Service container.
	 *
	 * @return void
	 */
	public function register( $container ) {
		add_filter( 'init', [ $this, 'registerStyles' ] );

		parent::register( $container );
	}

	/**
	 * Register checkout form styles
	 *
	 * @return void
	 */
	public function registerStyles() {
		$this->registerBlockTheme( $this->name, 'elegant', __( 'Elegant', 'checkout_engine' ), 'dist/styles/themes/elegant.css' );
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
				'label'       => $attributes['label'] ?? '',
				'description' => $attributes['description'] ?? '',
				'content'     => $content,
				'price_ids'   => [ '85109619-529d-47b3-98c3-ca90d22913e4', 'dd514523-297b-4a86-b5ff-6db0a70d7e17' ],
				'instance'    => self::$instance++,
			]
		);
	}
}
