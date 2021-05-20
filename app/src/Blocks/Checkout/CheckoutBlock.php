<?php

namespace CheckoutEngine\Blocks\Checkout;


class CheckoutBlock {

	public function register() {
		add_action( 'init', [ $this, 'blockEditorAssets' ] );
	}

	public function blockEditorAssets() {
		// automatically load dependencies and version
		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php' );

		wp_register_script(
			'checkout-form-editor',
			plugins_url( 'build/index.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version']
		);

		register_block_type(
			'checkout-engine/checkout-form',
			array(
				'editor_script' => 'checkout-form-editor',
			)
		);
	}
}
