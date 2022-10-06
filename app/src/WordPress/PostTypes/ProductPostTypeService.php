<?php

namespace SureCart\WordPress\PostTypes;

use SureCart\Models\Form;
use SureCart\WordPress\Pages\PageService;

/**
 * Form post type service class.
 */
class ProductPostTypeService {
	/**
	 * Holds the page service
	 *
	 * @var PageService
	 */
	protected $page_service;

	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc-product';

	/**
	 * Get the page service from the application container.
	 *
	 * @param PageService $page_service Page serice.
	 */
	public function __construct( PageService $page_service ) {
		$this->page_service = $page_service;
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerPostType' ] );
	}

	/**
	 * Register the post type
	 *
	 * @return void
	 */
	public function registerPostType() {
		register_post_type(
			$this->post_type,
			array(
				'labels'            => array(
					'name'                     => _x( 'Products', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'Product', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'Product', 'surecart' ),
					'add_new_item'             => __( 'Add new Product', 'surecart' ),
					'new_item'                 => __( 'New Product Page', 'surecart' ),
					'edit_item'                => __( 'Edit Product Page', 'surecart' ),
					'view_item'                => __( 'View Product', 'surecart' ),
					'all_items'                => __( 'All Products', 'surecart' ),
					'search_items'             => __( 'Search Products', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'Products list navigation', 'surecart' ),
					'items_list'               => __( 'Products list', 'surecart' ),
					'item_published'           => __( 'Product published.', 'surecart' ),
					'item_published_privately' => __( 'Product published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'Product reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'Product scheduled.', 'surecart' ),
					'item_updated'             => __( 'Product updated.', 'surecart' ),
				),
				'public'            => true,
				'show_ui'           => true,
				'show_in_admin_bar' => true,
				'show_in_menu'      => false, // remove from menu.
				'rewrite'           => [
					'slug'       => 'product',
					'with_front' => false,
				],
				'show_in_rest'      => true,
				'rest_base'         => 'sc-products',
				'map_meta_cap'      => true,
				'supports'          => array(
					'editor',
					'custom-fields', // todo: maybe remove.
					'revisions',
				),
			)
		);
	}
}
