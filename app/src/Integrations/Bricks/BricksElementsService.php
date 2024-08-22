<?php

namespace SureCart\Integrations\Bricks;

use SureCart\Migration\ProductPageWrapperService;

/**
 * This class handles bricks elements functionality.
 */
class BricksElementsService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Register the elements.
		add_action( 'init', [ $this, 'registerElements' ], 11 );

		// Add template types.
		add_filter( 'bricks/setup/control_options', [ $this, 'addTemplateTypes' ], 11 );

		// handle the default active template for our post type.
		add_filter( 'bricks/active_templates', [ $this, 'setDefaultProductTemplate' ], 10, 3 );

		// handle the default active template for our collection.
		add_filter( 'bricks/active_templates', [ $this, 'setDefaultCollectionTemplate' ], 10, 3 );

		// Handle the product page wrapper.
		add_filter( 'bricks/frontend/render_data', [ $this, 'handleProductPageWrapper' ], 10, 2 );
	}

	/**
	 * Register the elements.
	 *
	 * @return void
	 */
	public function registerElements() {
		if ( ! class_exists( '\Bricks\Elements' ) ) {
			return;
		}

		$elements = glob( __DIR__ . '/Elements/**' );
		foreach ( $elements as $file ) {
			if ( basename( $file ) === 'Product.php' ) {
				\Bricks\Elements::register_element( $file );
			}
		}

		foreach ( $elements as $file ) {
			if ( basename( $file ) === 'ProductCard.php' ) {
				\Bricks\Elements::register_element( $file );
			}
		}

		foreach ( $elements as $file ) {
			if ( basename( $file ) === 'Product.php' ) {
				continue;
			}
			\Bricks\Elements::register_element( $file );
		}
	}

	/**
	 * Set the default template for the post type.
	 * This will only apply if the post has not been edited directly by bricks.
	 *
	 * @param array  $active_templates Active templates.
	 * @param int    $post_id          Post ID.
	 * @param string $content_type     Content type.
	 *
	 * @return self
	 */
	public function setDefaultProductTemplate( $active_templates, $post_id, $content_type ) {
		// Only run my logic on the frontend.
		if ( ! bricks_is_frontend() ) {
			return $active_templates;
		}

		// Return if single post $content_type is not 'content'.
		if ( 'content' !== $content_type ) {
			return $active_templates;
		}

		// Return: Current post type is not our post type.
		$post_type = get_post_type( $post_id );
		if ( 'sc_product' !== $post_type ) {
			return $active_templates;
		}

		// if the post has been edited directly by bricks, use that.
		$bricks_data = \Bricks\Database::get_data( $post_id, 'content' );
		if ( count( $bricks_data ) > 0 ) {
			return $active_templates;
		}

		// apply a template, but only if there are no conditions.
		$template_ids = \Bricks\Templates::get_templates_by_type( 'sc_product' );
		foreach ( $template_ids as $id ) {
			$template_conditions = \Bricks\Helpers::get_template_setting( 'templateConditions', $id );
			if ( empty( $template_conditions ) ) {
				$active_templates['content'] = $id;
				return $active_templates;
			}
		}

		return $active_templates;
	}

	/**
	 * Set the default template for the post type.
	 * This will only apply if the post has not been edited directly by bricks.
	 *
	 * @param array  $active_templates Active templates.
	 * @param int    $post_id          Post ID.
	 * @param string $content_type     Content type.
	 *
	 * @return self
	 */
	public function setDefaultCollectionTemplate( $active_templates, $post_id, $content_type ) {
		// Only run my logic on the frontend.
		if ( ! bricks_is_frontend() ) {
			return $active_templates;
		}

		// Return if single post $content_type is not 'content'.
		if ( 'archive' !== $content_type ) {
			return $active_templates;
		}

		if ( ! is_tax( 'sc_collection' ) ) {
			return $active_templates;
		}

		if ( ! empty( $active_templates['archive'] ) ) {
			return $active_templates;
		}

		// apply a template, but only if there are no conditions.
		$template_ids = \Bricks\Templates::get_templates_by_type( 'sc_collection' );
		foreach ( $template_ids as $id ) {
			$template_conditions = \Bricks\Helpers::get_template_setting( 'templateConditions', $id );
			if ( empty( $template_conditions ) ) {
				$active_templates['archive'] = $id;
				return $active_templates;
			}
		}

		return $active_templates;
	}

	/**
	 *  Add template types to control options
	 *
	 * @param array $control_options Control options.
	 *
	 * @return array
	 */
	public function addTemplateTypes( $control_options ) {
		$control_options['templateTypes']['sc_product']    = esc_html__( 'SureCart - Single Product', 'surecart' );
		$control_options['templateTypes']['sc_collection'] = esc_html__( 'SureCart - Collection Archive', 'surecart' );

		return $control_options;
	}

	/**
	 * Handle the product page wrapper
	 *
	 * @param string $content Content of Shortcode.
	 *
	 * @return string $content Content of the product page.
	 */
	public function handleProductPageWrapper( string $content ): string {
		return ( new ProductPageWrapperService( $content ) )->wrap();
	}
}
