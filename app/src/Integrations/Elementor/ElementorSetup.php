<?php

namespace SureCart\Integrations\Elementor;

use Elementor\Core\Base\Document;
use ElementorPro\Modules\LoopBuilder\Documents\Loop as LoopDocument;


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
	const SURECART_SHOP_PAGE_LOOP_TEMPLATE = 'surecart_elementor_shop_page_loop_template';
	const SURECART_SHOP_PAGE_TEMPLATE      = 'surecart_elementor_shop_page_template';

	/**
	 * Constructor.
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'createTemplates' ] );
	}

	/**
	 * Create Surecart templates.
	 *
	 * @return void
	 */
	public function createTemplates(): void {
		$elementor = \Elementor\Plugin::$instance;

		if ( ! $elementor ) {
			return;
		}

		$this->createProductTemplate();
		$this->createShopPageLoopItemTemplate();
		$this->createShopPageTemplate();
	}

	/**
	 * Create product template.
	 *
	 * @return void
	 */
	public function createProductTemplate(): void {
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

	/**
	 * Create SureCart Shop Page Loop Item Template.
	 *
	 * @return void
	 */
	public function createShopPageLoopItemTemplate(): void {
		// If has no option in database, create the template.
		if ( get_option( self::SURECART_SHOP_PAGE_LOOP_TEMPLATE ) ) {
			return;
		}

		try {
			$template_path = SURECART_PLUGIN_DIR . '/templates/elementor/surecart-shop-page-loop-item.json';
			if ( ! is_file( $template_path ) || ! is_readable( $template_path ) ) {
				throw new \Exception( __( 'Template file not found or not readable.', 'surecart' ) );
			}

			$template_content = file_get_contents( $template_path );

			$result = \Elementor\Plugin::instance()->templates_manager
				->import_template(
					[
						'fileData' => base64_encode( $template_content ),
						'fileName' => 'surecart-shop-page-loop-item.json',
					]
				);

			if ( empty( $result ) || empty( $result[0] ) ) {
				return;
			}

			$template_id = $result[0];

			update_post_meta( $template_id, '_elementor_edit_mode', 'builder' );
			update_post_meta( $template_id, '_elementor_template_type', 'wp-page' );
			update_post_meta( $template_id, Document::TYPE_META_KEY, LoopDocument::get_type() );

			update_post_meta( $template_id, '_elementor_version', ELEMENTOR_VERSION );
			update_post_meta( $template_id, '_elementor_pro_version', ELEMENTOR_PRO_VERSION ?? '' );
			update_post_meta( $template_id, '_wp_page_template', 'default' );
			update_post_meta(
				$template_id,
				'_elementor_data',
				json_decode( $template_content, true )
			);

			// Save the template ID to the option.
			update_option( self::SURECART_SHOP_PAGE_LOOP_TEMPLATE, $template_id );
		} catch ( \Throwable $th ) {
			// Skip if there is an error.
			error_log( 'Error creating SureCart Shop Page Loop Item template: ' );
			error_log( print_r( $th, true ) );
		}
	}

	/**
	 * Create SureCart Shop Page Template.
	 *
	 * @return void
	 */
	public function createShopPageTemplate(): void {
		// If has no option in database, create the template.
		if ( get_option( self::SURECART_SHOP_PAGE_TEMPLATE ) ) {
			return;
		}

		try {
			$template_path = SURECART_PLUGIN_DIR . '/templates/elementor/surecart-shop-page.json';
			if ( ! is_file( $template_path ) || ! is_readable( $template_path ) ) {
				throw new \Exception( __( 'Template file not found or not readable.', 'surecart' ) );
			}

			$template_content = file_get_contents( $template_path );

			// Replate the loop item template ID.
			$loop_item_template = get_option( self::SURECART_SHOP_PAGE_LOOP_TEMPLATE );
			if ( $loop_item_template ) {
				// "template_id": null something like this to "template_id": 123
				$template_content = preg_replace(
					'/("template_id":\s*)\d+/',
					'$1' . $loop_item_template['template_id'] ?? 0,
					$template_content
				);
			}

			$result = \Elementor\Plugin::instance()->templates_manager
				->import_template(
					[
						'fileData' => base64_encode( $template_content ),
						'fileName' => 'surecart-shop-page.json',
					]
				);

			if ( empty( $result ) || empty( $result[0] ) ) {
				return;
			}

			$template_id = $result[0];

			update_post_meta( $template_id, '_elementor_edit_mode', 'builder' );
			update_post_meta( $template_id, '_elementor_template_type', 'wp-page' );
			update_post_meta( $template_id, '_elementor_version', ELEMENTOR_VERSION );
			update_post_meta( $template_id, '_elementor_pro_version', ELEMENTOR_PRO_VERSION ?? '' );
			update_post_meta( $template_id, '_wp_page_template', 'default' );
			update_post_meta(
				$template_id,
				'_elementor_data',
				json_decode( $template_content, true )
			);

			// Save the template ID to the option.
			update_option( self::SURECART_SHOP_PAGE_TEMPLATE, $template_id );
		} catch ( \Throwable $th ) {
			// Skip if there is an error.
			error_log( 'Error creating SureCart Shop Page template: ' );
			error_log( print_r( $th, true ) );
		}
	}
}
