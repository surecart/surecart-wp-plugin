<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Form post type service class.
 */
class VariantOptionPostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_variant_option';

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
					'name'                     => _x( 'SureCart Variant Options', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart Variant Option', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart Variant Option', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart Variant Option', 'surecart' ),
					'new_item'                 => __( 'New SureCart Variant Option', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart Variant Option', 'surecart' ),
					'view_item'                => __( 'View SureCart Variant Option', 'surecart' ),
					'all_items'                => __( 'All SureCart Variant Options', 'surecart' ),
					'search_items'             => __( 'Search SureCart Variant Options', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart Variant Options list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart Variant Options list', 'surecart' ),
					'item_published'           => __( 'SureCart Variant Option published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart Variant Option published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart Variant Option reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart Variant Option scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart Variant Option updated.', 'surecart' ),
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
