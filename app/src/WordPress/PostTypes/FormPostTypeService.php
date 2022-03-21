<?php

namespace CheckoutEngine\WordPress\PostTypes;

use CheckoutEngine\Models\Form;
use CheckoutEngine\WordPress\Pages\PageService;

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
	protected $post_type = 'sc_form';

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
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'display_post_states', [ $this, 'displayDefaultFormStatus' ] );
		add_action( 'init', [ $this, 'registerPostType' ] );

		add_filter( "manage_{$this->post_type}_posts_columns", [ $this, 'postTypeColumns' ], 1 );
		add_action( "manage_{$this->post_type}_posts_custom_column", [ $this, 'postTypeContent' ], 10, 2 );
	}

	/**
	 * Get the form post type.
	 *
	 * @return string post type.
	 */
	public function getPostType() {
		return $this->post_type;
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
			$states[] = __( 'Default', 'surecart' );
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
		return $this->page_service->get( $option, 'sc_form' );
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
	 * Find a form by id.
	 *
	 * @param integer $id Post id.
	 * @return WP_Post|null
	 */
	public function get( $id ) {
		return $this->findById( $id );
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
					'name'                     => _x( 'Checkout Forms', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'Checkout Form', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'Checkout Form', 'surecart' ),
					'add_new_item'             => __( 'Add new Checkout Form', 'surecart' ),
					'new_item'                 => __( 'New Checkout Form', 'surecart' ),
					'edit_item'                => __( 'Edit Checkout Form', 'surecart' ),
					'view_item'                => __( 'View Checkout Form', 'surecart' ),
					'all_items'                => __( 'All Checkout Forms', 'surecart' ),
					'search_items'             => __( 'Search Checkout Forms', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'Checkout Forms list navigation', 'surecart' ),
					'items_list'               => __( 'Checkout Forms list', 'surecart' ),
					'item_published'           => __( 'Checkout Form published.', 'surecart' ),
					'item_published_privately' => __( 'Checkout Form published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'Checkout Form reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'Checkout Form scheduled.', 'surecart' ),
					'item_updated'             => __( 'Checkout Form updated.', 'surecart' ),
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
				'template'              => [
					[
						'checkout-engine/form',
						[],
						[],
					],
				],
				'template_lock'         => 'all',
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

	public function postTypeColumns( $defaults ) {
		$columns = array_merge(
			$defaults,
			array(
				'title'     => $defaults['title'],
				'public'    => __( 'Published In', 'surecart' ),
				'mode'      => __( 'Mode', 'surecart' ),
				// 'products'  => __( 'Included Products', 'surecart' ),
				'shortcode' => __( 'Shortcode', 'presto-player' ),
			)
		);

		$v = $columns['date'];
		unset( $columns['date'] );
		$columns['date'] = $v;
		return $columns;
	}

	/**
	 * Post type content column.
	 *
	 * @param string  $column_name Column name.
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function postTypeContent( $column_name, $post_ID ) {
		if ( 'shortcode' === $column_name ) {
			$this->columnShortcode( $post_ID );
		}
		if ( 'public' === $column_name ) {
			$this->columnPosts( $post_ID );
		}
		if ( 'products' === $column_name ) {
			$this->columnProducts( $post_ID );
		}
		if ( 'mode' === $column_name ) {
			$this->columnMode( $post_ID );
		}
	}

	/**
	 * Get the form's mode.
	 *
	 * @param int $post_ID Post id.
	 * @return void
	 */
	public function columnMode( $post_ID ) {
		$mode = Form::getMode( $post_ID );
		if ( 'test' === $mode ) {
			echo '<ce-tag type="warning">' . esc_html__( 'Test', 'surecart' ) . '</ce-tag>';
			return;
		}

		echo '<ce-tag type="success">' . esc_html__( 'Live', 'surecart' ) . '</ce-tag>';
	}

	/**
	 * Get the shortcode for the current post.
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnShortcode( $post_ID ) {
		echo '<code>[sc_form id=' . (int) $post_ID . ']</code>';
	}

	/**
	 * Get the posts where this form appears.
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnPosts( $post_ID ) {
		$posts = Form::getPosts( $post_ID );

		$post_names = array_map(
			function ( $post ) {
				return '<a href="' . esc_url( get_edit_post_link( $post->ID ) ) . '">' . wp_kses_post( $post->post_title ) . '</a>';
			},
			$posts,
		);

		echo implode( ', ', $post_names );
	}

	/**
	 * Get the products that are in this form by default
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnProducts( $post_ID ) {
		$products = Form::getProducts( $post_ID );

		$product_names = array_map(
			function ( $product ) {
				return '<a href="' . esc_url( \CheckoutEngine::getUrl()->edit( 'product', $product->id ) ) . '">' . wp_kses_post( $product->name ) . '</a>';
			},
			$products,
		);

		echo implode( ', ', $product_names );
	}
}
