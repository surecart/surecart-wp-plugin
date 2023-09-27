<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Product collection page post type service class.
 */
class ProductCollectionsPagePostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_collection';

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
					'name'                     => _x( 'SureCart product collections', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart product collection', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart product collection', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart product collection', 'surecart' ),
					'new_item'                 => __( 'New SureCart product collection', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart product collection', 'surecart' ),
					'view_item'                => __( 'View SureCart product collection', 'surecart' ),
					'all_items'                => __( 'All SureCart product collections', 'surecart' ),
					'search_items'             => __( 'Search SureCart product collections', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart product collections list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart product collections list', 'surecart' ),
					'item_published'           => __( 'SureCart product collection published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart product collection published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart product collection reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart product collection scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart product collection updated.', 'surecart' ),
				),
				'public'            => true,
				'show_ui'           => false,
				'show_in_menu'      => false,
				'rewrite'           => false,
				'show_in_rest'      => false,
				'show_in_nav_menus' => false,
				'can_export'        => false,
				'capability_type'   => 'post',
				'map_meta_cap'      => true,
				'supports'          => array(
					'custom-fields',
				),
			)
		);
	}
}
