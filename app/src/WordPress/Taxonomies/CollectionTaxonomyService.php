<?php

namespace SureCart\WordPress\Taxonomies;

use SureCart\Models\Product;
use SureCart\Models\ProductMedia;

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
				'public'            => true,
				'show_in_rest'      => true,
				'hierarchical'      => false,
				'show_admin_column' => true,
				'rewrite'           => [
					'slug' => 'collections',
				],
			]
		);
	}
}
