<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Product bump page post type service class.
 */
class ProductBumpPagePostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_bump';

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
					'name'                     => _x( 'SureCart bumps', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart bump', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart bump', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart bump', 'surecart' ),
					'new_item'                 => __( 'New SureCart bump', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart bump', 'surecart' ),
					'view_item'                => __( 'View SureCart bump', 'surecart' ),
					'all_items'                => __( 'All SureCart bumps', 'surecart' ),
					'search_items'             => __( 'Search SureCart bumps', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart bumps list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart bumps list', 'surecart' ),
					'item_published'           => __( 'SureCart bump published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart bump published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart bump reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart bump scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart bump updated.', 'surecart' ),
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
