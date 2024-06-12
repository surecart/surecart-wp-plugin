<?php

declare(strict_types=1);

namespace SureCart\WordPress\Templates;

use SureCartVendors\Pimple\Container;

/**
 * The collection template service.
 */
class CollectionTemplatesService {
	/**
	 * The service container.
	 *
	 * @var Container $container
	 */
	private Container $container;

	/**
	 * The template file/name associations.
	 *
	 * @var array
	 */
	private array $templates = array();

	/**
	 * The post type for the templates.
	 *
	 * @var string
	 */
	private string $post_type = 'sc_collection';

	/**
	 * SureCart plugin slug.
	 *
	 * This is used to save templates to the DB which are stored against this value in the wp_terms table.
	 *
	 * @var string
	 */
	const PLUGIN_SLUG = 'surecart/surecart';

	/**
	 * Get things going.
	 *
	 * @param array $container The service container.
	 * @param array $templates The template file/name associations.
	 */
	public function __construct( $container, $templates ) {
		$this->container = $container;
		$this->templates = $templates;
	}

	/**
	 * Bootstrap actions and filters.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// add_filter( 'theme_' . $this->post_type . '_templates', array( $this, 'addTemplates' ) );
	}

	/**
	 * Add surecart_current_collection to list of query vars.
	 *
	 * @param array $vars The query vars.
	 * @return array
	 */
	public function addCurrentCollectionQueryVar( array $vars ): array {
		$vars[] = 'surecart_current_collection';
		return $vars;
	}

	/**
	 * Add the templates. to the existing templates.
	 *
	 * @param array $posts_templates Existing templates.
	 *
	 * @return array
	 */
	public function addTemplates( array $posts_templates ): array {
		return array_merge( $posts_templates, $this->templates );
	}

	/**
	 * Include the template if it is set.
	 *
	 * @param string $template Template url.
	 *
	 * @return string
	 */
	public function includeTemplate( string $template ): string {
		global $post;
		$id = $post->ID ?? null;

		// check for collection and use the template id.
		$collection = get_query_var( 'surecart_current_collection' );

		if ( ! empty( $collection->metadata->wp_template_id ) ) {
			$page_template = $collection->metadata->wp_template_id;
		} else {
			$page_template = get_post_meta( $id, '_wp_page_template', true );
		}

		// if the set template does not match one of these templates.
		if ( empty( $page_template ) || false === strpos( $page_template, '.php' ) ) {
			return $template;
		}

		$file = trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . '/templates/' . $page_template;

		// Return file if it exists.
		if ( file_exists( $file ) ) {
			return $file;
		}

		return $template;
	}
}
