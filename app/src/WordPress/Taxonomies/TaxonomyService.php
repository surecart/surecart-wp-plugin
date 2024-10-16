<?php

namespace SureCart\WordPress\Taxonomies;

/**
 * Taxonomy Service.
 */
class TaxonomyService {
	/**
	 * Bootstrap the service.
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'manageScreen' ] );
	}

	/**
	 * Removes the posts column from the taxonomy table since this can
	 * lead them to edit the product post type directly.
	 */
	public function manageScreen() {
		$taxonomies = get_taxonomies( array(), 'names' );
		foreach ( $taxonomies as $taxonomy ) {
			$taxonomy_object = get_taxonomy( $taxonomy );
			if ( ! in_array( 'sc_product', (array) $taxonomy_object->object_type, true ) ) {
				continue;
			}

			add_filter(
				"manage_edit-{$taxonomy}_columns",
				function ( $columns ) {
					unset( $columns['posts'] );
					return $columns;
				}
			);
		}
	}
}
