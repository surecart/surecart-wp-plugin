<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Form post type service class.
 */
class PricePostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_price';

	/**
	 * Bootstrap service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerPostType' ] );
	}

	/**
	 * Register the product post type.
	 *
	 * @return void
	 */
	public function registerPostType() {
		register_post_type(
			$this->post_type,
			array(
				'labels'            => array(
					'name'                     => _x( 'SureCart Prices', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart Price', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart Price', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart Price', 'surecart' ),
					'new_item'                 => __( 'New SureCart Price', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart Price', 'surecart' ),
					'view_item'                => __( 'View SureCart Price', 'surecart' ),
					'all_items'                => __( 'All SureCart Prices', 'surecart' ),
					'search_items'             => __( 'Search SureCart Prices', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart Prices list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart Prices list', 'surecart' ),
					'item_published'           => __( 'SureCart Price published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart Price published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart Price reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart Price scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart Price updated.', 'surecart' ),
				),
				'hierarchical'      => true,
				'public'            => false,
				'show_ui'           => true,
				'show_in_menu'      => true,
				'rewrite'           => false,
				'show_in_rest'      => false,
				'show_in_nav_menus' => false,
				'can_export'        => false,
				'capability_type'   => 'post',
				'map_meta_cap'      => true,
				'supports'          => array(
					'title',
					'custom-fields',
					'page-attributes',
				),
			)
		);
	}
}
