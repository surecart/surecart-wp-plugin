<?php

namespace CheckoutEngine\WordPress\PostTypes;

use CheckoutEngine\Models\Form;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register our form post type
 */
class FormPostTypeServiceProvider implements ServiceProviderInterface {
	protected $post_type = 'ce_form';

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		add_action( 'init', [ $this, 'registerPostType' ] );
		add_filter( "manage_{$this->post_type}_posts_columns", [ $this, 'postTypeColumns' ], 1 );
		add_action( "manage_{$this->post_type}_posts_custom_column", [ $this, 'postTypeContent' ], 10, 2 );
	}

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}

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
				'show_in_menu'          => true,
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

	public function postTypeColumns( $defaults ) {
		$columns = array_merge(
			$defaults,
			array(
				'title'     => $defaults['title'],
				'posts'     => __( 'Posts', 'checkout_engine' ),
				'products'  => __( 'Products', 'checkout_engine' ),
				'shortcode' => __( 'Shortcode', 'presto-player' ),
			)
		);

		$v = $columns['date'];
		unset( $columns['date'] );
		$columns['date'] = $v;
		return $columns;
	}

	public function postTypeContent( $column_name, $post_ID ) {
		if ( 'shortcode' === $column_name ) {
			return $this->columnShortcode( $post_ID );
		}
		if ( 'posts' === $column_name ) {
			return $this->columnPosts( $post_ID );
		}
		if ( 'products' === $column_name ) {
			return $this->columnProducts( $post_ID );
		}
	}

	/**
	 * Get the shortcode for the current post.
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnShortcode( $post_ID ) {
		echo '<code>[ce_form id=' . (int) $post_ID . ']</code>';
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
