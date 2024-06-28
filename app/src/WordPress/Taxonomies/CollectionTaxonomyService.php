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
		add_action( 'init', array( $this, 'register' ) );
		add_filter( 'taxonomy_template', array( $this, 'template' ) );
	}

	/**
	 * Get the template for the taxonomy.
	 *
	 * @param string $template The template.
	 *
	 * @return string
	 */
	public function template( $template ) {
		// not our taxonomy.
		if ( ! is_tax( $this->slug ) ) {
			return $template;
		}

		$term       = get_queried_object();
		$collection = get_term_meta( $term->term_id, 'collection', true );

		if ( wp_is_block_theme() && ! empty( $collection->metadata->wp_template_id ) ) {
			global $_wp_current_template_id, $_wp_current_template_content;
			$_wp_current_template_id = $collection->metadata->wp_template_id;
			$block_template          = get_block_template( $collection->metadata->wp_template_id );
			if ( ! empty( $block_template ) ) {
				$_wp_current_template_content = $block_template->content ?? '';
			}
		}

		// the theme has provided a taxonomy template, or we are not on the collection taxonomy.
		if ( ! empty( $template ) || ! is_tax( $this->slug ) ) {
			return $template;
		}

		// check if we are on the collection taxonomy.
		return plugin_dir_path( SURECART_PLUGIN_FILE ) . '/templates/pages/template-surecart-collection.php';
	}

	/**
	 * Register the taxonomy
	 *
	 * @return void
	 */
	public function register() {
		register_taxonomy(
			$this->slug,
			array( 'sc_product' ),
			array(
				'label'             => __( 'Collections', 'surecart' ),
				'labels'            => array(
					'name'              => _x( 'Collections', 'taxonomy general name', 'surecart' ),
					'singular_name'     => _x( 'Collection', 'taxonomy singular name', 'surecart' ),
					'search_items'      => __( 'Search Collections', 'surecart' ),
					'all_items'         => __( 'All Collections', 'surecart' ),
					'parent_item'       => __( 'parent Collection', 'surecart' ),
					'parent_item_colon' => __( 'parent Collection:', 'surecart' ),
					'edit_item'         => __( 'Edit Collection', 'surecart' ),
					'update_item'       => __( 'Update Collection', 'surecart' ),
					'add_new_item'      => __( 'Add New Collection', 'surecart' ),
					'new_item_name'     => __( 'New Collection Name', 'surecart' ),
					'menu_name'         => __( 'Collection', 'surecart' ),
				),
				'public '           => true,
				'show_in_rest'      => true,
				'hierarchical'      => false,
				'show_in_ui'        => true,
				'show_admin_column' => true,
				'rewrite'           => array(
					'slug'       => \SureCart::settings()->permalinks()->getBase( 'collection_page' ),
					'with_front' => false,
				),
			)
		);
	}
}
