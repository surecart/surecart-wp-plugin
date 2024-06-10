<?php

namespace SureCart\WordPress\Taxonomies;


/**
 * Form post type service class.
 */
class CollectionTaxonomyService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $slug = 'sc_collection';

	/**
	 * Bootstrap service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'register' ] );
		add_action( 'template_include', [$this, 'template'] );
	}

	/**
	 * Register the taxonomy
	 *
	 * @return void
	 */
	public function register() {
		register_taxonomy(
			$this->slug,
			[ 'sc_product' ],
			[
				'label'             => __( 'Collections', 'surecart' ),
				'labels'            => [
					'name'              => _x( 'Collections', 'taxonomy general name', 'surecart' ),
					'singular_name'     => _x( 'Collection', 'taxonomy singular name', 'surecart' ),
					'search_items'      => __( 'Search Collections', 'surecart' ),
					'all_items'         => __( 'All Collections', 'surecart' ),
					'parent_item'       => __( 'Parent Collection', 'surecart' ),
					'parent_item_colon' => __( 'Parent Collection:', 'surecart' ),
					'edit_item'         => __( 'Edit Collection', 'surecart' ),
					'update_item'       => __( 'Update Collection', 'surecart' ),
					'add_new_item'      => __( 'Add New Collection', 'surecart' ),
					'new_item_name'     => __( 'New Collection Name', 'surecart' ),
					'menu_name'         => __( 'Collection', 'surecart' ),
				],
				'public'            => true,
				'show_in_rest'      => true,
				'hierarchical'      => false,
				'show_in_ui'        => true,
				'show_admin_column' => true,
				'rewrite'           => [
					'slug'       => \SureCart::settings()->permalinks()->getBase( 'collection_page' ),
					'with_front' => false,
				],
			]
		);
	}

	/**
	 * Handle the custom collection template.
	 *
	 * @param string $template The template.
	 *
	 * @return void
	 */
	public function template($template) {
		if (is_tax($this->slug)) {
			$term = get_queried_object();

			// get the template.
			$collection_template = get_term_meta($term->term_id, '_wp_page_template', true);

			// if we don't have a template, return the default.
			if ( empty( $collection_template )) {
				return $template;
			}

			// it's a block theme, and we have a .php template, return the block theme template.
			if ( wp_is_block_theme() && false !== strpos( $collection_template, '.php' ) ) {
				return $template;
			}

			// get the file from the plugin.
			$file = plugin_dir_path( SURECART_PLUGIN_FILE ) . '/templates/' . $collection_template;

			// Return file if it exists.
			if ( file_exists( $file ) ) {
				return $file;
			}
		}
		return $template;
	}
}
