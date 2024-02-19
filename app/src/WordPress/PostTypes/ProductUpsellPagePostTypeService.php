<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Product upsell page post type service class.
 */
class ProductUpsellPagePostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_upsell';

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
					'name'                     => _x( 'SureCart upsells', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart upsell', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart upsell', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart upsell', 'surecart' ),
					'new_item'                 => __( 'New SureCart upsell', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart upsell', 'surecart' ),
					'view_item'                => __( 'View SureCart upsell', 'surecart' ),
					'all_items'                => __( 'All SureCart upsells', 'surecart' ),
					'search_items'             => __( 'Search SureCart upsells', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart upsells list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart upsells list', 'surecart' ),
					'item_published'           => __( 'SureCart upsell published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart upsell published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart upsell reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart upsell scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart upsell updated.', 'surecart' ),
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
