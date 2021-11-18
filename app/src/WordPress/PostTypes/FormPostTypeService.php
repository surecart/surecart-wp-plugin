<?php

namespace CheckoutEngine\WordPress\PostTypes;

use CheckoutEngine\WordPress\PageService;

/**
 * Form post type service class.
 */
class FormPostTypeService {
	/**
	 * Holds the page service
	 *
	 * @var PageService
	 */
	protected $page_service;

	/**
	 * The default form name.
	 *
	 * @var string
	 */
	protected $default_form_name = 'checkout';

	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'ce_form';

	/**
	 * Group Prefix
	 *
	 * @var string
	 */
	protected $group_prefix = 'ce-checkout-';

	/**
	 * Get the page service from the application container.
	 *
	 * @param PageService $page_service Page serice.
	 */
	public function __construct( PageService $page_service ) {
		$this->page_service = $page_service;
	}

	/**
	 * Adds status indicator for this website.
	 *
	 * @param array $states States array.
	 *
	 * @return array States array with ours added
	 */
	public function displayDefaultFormStatus( $states ) {
		global $post;

		// bail if not our post type.
		if ( get_post_type( $post ) !== $this->post_type ) {
			return $states;
		}

		if ( $post->ID === $this->getDefaultId() ) {
			$states[] = __( 'Default', 'checkout_engine' );
		}

		return $states;
	}

	/**
	 * Find a form by its option name.
	 *
	 * @param string $option Option name.
	 * @return WP_Post|null
	 */
	public function findByOptionName( $option ) {
		return $this->page_service->get( $option, 'ce_form' );
	}

	/**
	 * Find a form by id.
	 *
	 * @param integer $id Post id.
	 * @return WP_Post|null
	 */
	public function findById( $id ) {
		return get_post( $id );
	}

	/**
	 * Get the default checkout form post.
	 *
	 * @return WP_Post|null
	 */
	public function getDefault() {
		return $this->findByOptionName( $this->default_form_name );
	}

	/**
	 * Get the default checkout form post.
	 *
	 * @return WP_Post|null
	 */
	public function getDefaultId() {
		$form = $this->findByOptionName( $this->default_form_name );
		return $form ? $form->ID : null;
	}

	/**
	 * Get the default group id.
	 *
	 * @return string.
	 */
	public function getDefaultGroupId() {
		$form = $this->getDefault();
		return $this->group_prefix . (int) $form->ID;
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
				'labels'                => array(
					'name'                     => _x( 'Checkout Forms', 'post type general name', 'checkout_engine' ),
					'singular_name'            => _x( 'Checkout Form', 'post type singular name', 'checkout_engine' ),
					'add_new'                  => _x( 'Add New', 'Checkout Form', 'checkout_engine' ),
					'add_new_item'             => __( 'Add new Checkout Form', 'checkout_engine' ),
					'new_item'                 => __( 'New Checkout Form', 'checkout_engine' ),
					'edit_item'                => __( 'Edit Checkout Form', 'checkout_engine' ),
					'view_item'                => __( 'View Checkout Form', 'checkout_engine' ),
					'all_items'                => __( 'All Checkout Forms', 'checkout_engine' ),
					'search_items'             => __( 'Search Checkout Forms', 'checkout_engine' ),
					'not_found'                => __( 'No checkout forms found.', 'checkout_engine' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'checkout_engine' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'checkout_engine' ),
					'items_list_navigation'    => __( 'Checkout Forms list navigation', 'checkout_engine' ),
					'items_list'               => __( 'Checkout Forms list', 'checkout_engine' ),
					'item_published'           => __( 'Checkout Form published.', 'checkout_engine' ),
					'item_published_privately' => __( 'Checkout Form published privately.', 'checkout_engine' ),
					'item_reverted_to_draft'   => __( 'Checkout Form reverted to draft.', 'checkout_engine' ),
					'item_scheduled'           => __( 'Checkout Form scheduled.', 'checkout_engine' ),
					'item_updated'             => __( 'Checkout Form updated.', 'checkout_engine' ),
				),
				'public'                => false,
				'show_ui'               => true,
				'show_in_menu'          => false,
				'rewrite'               => false,
				'show_in_rest'          => true,
				'rest_base'             => 'ce-forms',
				'rest_controller_class' => 'WP_REST_Blocks_Controller',
				'capability_type'       => 'block',
				'capabilities'          => array(
					// You need to be able to edit posts, in order to read blocks in their raw form.
					'read'                   => 'edit_posts',
					// You need to be able to publish posts, in order to create blocks.
					'create_posts'           => 'publish_posts',
					'edit_posts'             => 'edit_posts',
					'edit_published_posts'   => 'edit_published_posts',
					'delete_published_posts' => 'delete_published_posts',
					'edit_others_posts'      => 'edit_others_posts',
					'delete_others_posts'    => 'delete_others_posts',
				),
				'map_meta_cap'          => true,
				'supports'              => array(
					'title',
					'editor',
					'custom-fields',
					'revisions',
				),
			)
		);
	}
}
