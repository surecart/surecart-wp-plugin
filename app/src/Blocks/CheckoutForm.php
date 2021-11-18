<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Concerns\HasBlockTheme;

/**
 * Checkout block
 */
class CheckoutForm extends Block {

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
		$this->container = $container;

		$file = plugin_dir_path( CHECKOUT_ENGINE_PLUGIN_FILE ) . 'packages/blocks/blocks/checkout';

		register_block_type(
			$file,
			[
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
		static $seen_forms = array();

		if ( empty( $attributes['id'] ) ) {
			return '';
		}

		$form = get_post( $attributes['id'] );
		if ( ! $form || 'ce_form' !== $form->post_type ) {
			return '';
		}

		if ( isset( $seen_forms[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = defined( 'WP_DEBUG' ) && WP_DEBUG &&
				defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]' ) :
				'';
		}

		if ( 'publish' !== $form->post_status || ! empty( $form->post_password ) ) {
			return '';
		}

		$seen_forms[ $attributes['id'] ] = true;

		global $ce_form_id;
		$ce_form_id = $attributes['id'];
		$result     = do_blocks( $form->post_content );
		unset( $seen_forms[ $attributes['id'] ] );
		return $result;
	}
}
