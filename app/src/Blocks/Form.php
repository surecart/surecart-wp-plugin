<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Concerns\HasBlockTheme;

/**
 * Checkout block
 */
class Form extends Block {
	use HasblockTheme;

	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'form';

	/**
	 * Keep track of checkout form instances
	 * on the page with an id.
	 *
	 * @var integer
	 */
	private static $instance = 1;

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

	public function getClasses( $attributes ) {
		$block_alignment = isset( $attributes['align'] ) ? sanitize_text_field( $attributes['align'] ) : '';
		return ! empty( $block_alignment ) ? 'align' . $block_alignment : '';
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
				'align'       => $attributes['align'] ?? '',
				'label'       => $attributes['label'] ?? '',
				'font_size'   => $attributes['font_size'] ?? 16,
				'classes'     => $this->getClasses( $attributes ),
				'description' => $attributes['description'] ?? '',
				'content'     => $content,
				'choices'     => $attributes['choices'] ?? [],
				'success_url' => $attributes['redirect'] ?? trailingslashit( get_home_url() ) . 'thank-you',
				'i18n'        => [],
				'instance'    => self::$instance++,
			]
		);
	}
}
