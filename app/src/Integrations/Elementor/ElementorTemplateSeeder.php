<?php

namespace SureCart\Integrations\Elementor;

use Elementor\Core\Base\Document;
use ElementorPro\Modules\LoopBuilder\Documents\Loop as LoopDocument;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor Template Seeder.
 */
class ElementorTemplateSeeder {
	const SURECART_SHOP_PAGE_LOOP_TEMPLATE = 'surecart_elementor_shop_page_loop_template';

	/**
	 * Constructor.
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'maybeCreateShopPageLoopItemTemplate' ] );
	}

	/**
	 * Create SureCart Shop Page Loop Item Template.
	 *
	 * @return void
	 */
	public function maybeCreateShopPageLoopItemTemplate(): void {
		$elementor = \Elementor\Plugin::$instance;

		if ( ! $elementor ) {
			return;
		}

		if ( ! empty( $this->getShopPageLoopItemTemplate() ) ) {
			return;
		}

		$this->createShopPageLoopItemTemplate();
	}

	/**
	 * Get Shop Page Loop Item Template.
	 *
	 * @return null|\WP_Post
	 */
	public function getShopPageLoopItemTemplate() {
		$existing_templates = get_posts(
			[
				'post_type'      => 'elementor_library',
				'meta_key'       => self::SURECART_SHOP_PAGE_LOOP_TEMPLATE,
				'meta_value'     => 1,
				'posts_per_page' => 1,
				'fields'         => 'ids',
			]
		);

		if ( ! empty( $existing_templates ) ) {
			return $existing_templates[0];
		}

		return null;
	}

	/**
	 * Create SureCart Shop Page Loop Item Template.
	 *
	 * @return int|null
	 */
	public function createShopPageLoopItemTemplate() {
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

			if ( empty( $result ) || is_wp_error( $result ) ) {
				error_log( 'Error creating SureCart Shop Page Loop Item template: ' );
				error_log( print_r( $result, true ) );
				return;
			}

			$template    = $result[0];
			$template_id = $template['template_id'];

			update_post_meta( $template_id, Document::BUILT_WITH_ELEMENTOR_META_KEY, 'builder' );
			update_post_meta( $template_id, Document::TYPE_META_KEY, LoopDocument::get_type() );
			update_post_meta( $template_id, Document::PAGE_META_KEY, [] );
			update_post_meta( $template_id, '_elementor_source', 'post' );

			update_post_meta( $template_id, '_elementor_version', ELEMENTOR_VERSION );
			update_post_meta( $template_id, '_elementor_pro_version', ELEMENTOR_PRO_VERSION ?? '' );
			update_post_meta( $template_id, '_wp_page_template', 'default' );
			update_post_meta( $template_id, self::SURECART_SHOP_PAGE_LOOP_TEMPLATE, 1 );
			update_post_meta(
				$template_id,
				'_elementor_data',
				json_decode( $template_content, true )
			);

			return $template_id;
		} catch ( \Throwable $th ) {
			// Skip if there is an error.
			error_log( 'Error creating SureCart Shop Page Loop Item template: ' );
			error_log( print_r( $th, true ) );
			return null;
		}
	}
}
