<?php

namespace SureCart\Integrations\Bricks;

/**
 * Bricks template service.
 */
class BricksTemplateService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'surecart/scripts/admin/product/data', [ $this, 'addBricksEditLink' ], 10, 2 );
	}

	/**
	 * Add the bricks edit link to the data.
	 *
	 * @param array $data The data.
	 *
	 * @return array
	 */
	public function addBricksEditLink( $data ) {
		if ( method_exists( \Bricks\Helpers::class, 'get_builder_edit_link' ) ) {
			$product_id = $_GET['id'] ?? null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( empty( $product_id ) ) {
				return $data;
			}

			// Get the product by product id.
			$product = sc_get_product( $product_id );
			if ( is_wp_error( $product ) ) {
				return $data;
			}

			// Get the post by product id.
			$post = $product->post ?? null;
			if ( empty( $post ) ) {
				return $data;
			}

			// Get the bricks edit link.
			$data['bricks']['editLink'] = \Bricks\Helpers::get_builder_edit_link( $post->ID );
		}

		return $data;
	}

	/**
	 * Check if the current page is rendered with Bricks.
	 *
	 * @return bool
	 */
	public function isRenderedWithBricks(): bool {
		return class_exists( '\Bricks\Helpers' ) && \Bricks\Helpers::render_with_bricks();
	}
}
