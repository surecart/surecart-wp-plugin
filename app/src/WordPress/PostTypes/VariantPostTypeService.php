<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Form post type service class.
 */
class VariantPostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_variant';

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
					'name'                     => _x( 'SureCart Variants', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart Variant', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart Variant', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart Variant', 'surecart' ),
					'new_item'                 => __( 'New SureCart Variant', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart Variant', 'surecart' ),
					'view_item'                => __( 'View SureCart Variant', 'surecart' ),
					'all_items'                => __( 'All SureCart Variants', 'surecart' ),
					'search_items'             => __( 'Search SureCart Variants', 'surecart' ),
					'not_found'                => __( 'No variants found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No variants found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter variants list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart Variants list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart Variants list', 'surecart' ),
					'item_published'           => __( 'SureCart Variant published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart Variant published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart Variant reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart Variant scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart Variant updated.', 'surecart' ),
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
