<?php

namespace SureCart\Integrations\Elementor;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor setup.
 */
class ElementorSetup {
	/**
	 * SureCart single product template option name.
	 */
	const SURECART_SINGLE_PRODUCT_TEMPLATE = 'surecart_elementor_single_product_template';

	/**
	 * Constructor.
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'createProductTemplate' ] );
	}

	/**
	 * Create product template.
	 *
	 * @return void
	 */
	public function createProductTemplate(): void {
		$elementor = \Elementor\Plugin::$instance;

		if ( ! $elementor ) {
			return;
		}

		// If has no option in database, create the template.
		if ( get_option( self::SURECART_SINGLE_PRODUCT_TEMPLATE ) ) {
			return;
		}

		try {
			$template_path = SURECART_PLUGIN_DIR . '/templates/elementor/surecart-single-product.json';
			if ( ! is_file( $template_path ) || ! is_readable( $template_path ) ) {
				throw new \Exception( __( 'Template file not found or not readable.', 'surecart' ) );
			}

			$template_content = file_get_contents( $template_path );

			$result = \Elementor\Plugin::instance()->templates_manager
				->import_template(
					[
						'fileData' => base64_encode( $template_content ),
						'fileName' => 'surecart-single-product.json',
					]
				);

			if ( empty( $result ) || empty( $result[0] ) ) {
				return;
			}

			$template_id = $result[0];

			update_post_meta( $template_id, '_elementor_edit_mode', 'builder' );
			update_post_meta( $template_id, '_elementor_template_type', 'surecart-product' );
			update_post_meta( $template_id, '_elementor_version', ELEMENTOR_VERSION );
			update_post_meta( $template_id, '_elementor_pro_version', ELEMENTOR_PRO_VERSION ?? '' );
			update_post_meta( $template_id, '_wp_page_template', 'default' );
			update_post_meta(
				$template_id,
				'_elementor_data',
				json_decode( $template_content, true )
			);

			// Save the template ID to the option.
			update_option( self::SURECART_SINGLE_PRODUCT_TEMPLATE, $template_id );
		} catch ( \Throwable $th ) {
			// Skip if there is an error.
			error_log( 'Error creating SureCart Single Product template: ' );
			error_log( print_r( $th, true ) );
		}
	}
}
