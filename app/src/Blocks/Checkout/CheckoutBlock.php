<?php

namespace CheckoutEngine\Blocks\Checkout;

/**
 * Checkout Block
 *
 * @author Checkout Engine <andre@checkoutengine.com>
 * @since 1.0.0
 * @license GPL
 */
class CheckoutBlock {

	/**
	 * Register
	 *
	 * @return void
	 * @since 1.0.0
	 * @license GPL
	 */
	public function register() {
		add_action( 'admin_init', [ $this, 'enqueueEditorAssets' ] );
	}

	/**
	 * Enqueue block editor assets
	 *
	 * @return void
	 * @since 1.0.0
	 * @license GPL
	 */
	public function enqueueEditorAssets() {

		// automatically load dependencies and version.
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		wp_register_script(
			'checkout-form-editor',
			plugins_url( 'build/index.js', __FILE__ ),
			array_merge( [ 'checkout-engine-components' ], $asset_file['dependencies'] ),
			$asset_file['version'],
			true
		);

		register_block_type(
			'checkout-engine/checkout-form',
			[
				'editor_script' => 'checkout-form-editor',
			]
		);
	}
}
