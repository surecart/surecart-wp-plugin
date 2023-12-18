<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Form post type service class.
 */
class ProductPostTypeService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_product';

	/**
	 * Bootstrap service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerPostType' ] );
		add_action( 'posts_results', [ $this, 'addChildrenToProducts' ], 10, 2 );
		add_action( 'the_post', [ $this, 'addChildrenToProduct' ], 10, 2 );
	}

	/**
	 * Add children to products.
	 *
	 * @param \WP_Post[] $posts The posts.
	 * @param \WP_Query  $query  The query.
	 *
	 * @return \WP_Post[]
	 */
	public function addChildrenToProducts( $posts, $query ) {
		// Check if we're in the main query and dealing with 'sc_product' post type.
		if ( $this->post_type === $query->get( 'post_type' ) ) {
			// Gather the IDs of the sc_product posts.
			$product_ids = wp_list_pluck( $posts, 'ID' );

			// Fetch all sc_price posts whose parent is in the sc_product posts.
			$price_posts = get_posts(
				array(
					'post_type'       => 'sc_price',
					'post_parent__in' => $product_ids,
					'posts_per_page'  => -1,
					'nopaging'        => true,
				)
			);

			// Map sc_price posts to their respective sc_product.
			$prices_by_product = array();
			foreach ( $price_posts as $price_post ) {
				$prices_by_product[ $price_post->post_parent ][] = $price_post;
			}

			// Assign prices array to each sc_product post.
			foreach ( $posts as $post ) {
				if ( 'sc_product' === get_post_type( $post ) ) {
					$post->prices = $prices_by_product[ $post->ID ] ?? array();
				}
			}
		}

		return $posts;
	}

	/**
	 * Add children to an individual product.
	 *
	 * @param \WP_Post $post The post.
	 *
	 * @return void
	 */
	public function addChildrenToProduct( $post ) {
		// Check if the post is an 'sc_product'.
		if ( 'sc_product' === get_post_type( $post ) ) {
			// already got it through eager loading.
			if ( ! empty( $post->prices ) ) {
				return;
			}

			// Get the related 'sc_price' posts.
			$price_posts = get_posts(
				array(
					'post_type'      => 'sc_price',
					'post_parent'    => $post->ID,
					'posts_per_page' => -1, // Get all related posts.
					'nopaging'       => true,
				)
			);

			// Add the prices array to the post object.
			$post->prices = $price_posts;
		}
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
					'name'                     => _x( 'SureCart Products', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'SureCart Product', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'SureCart Product', 'surecart' ),
					'add_new_item'             => __( 'Add new SureCart Product', 'surecart' ),
					'new_item'                 => __( 'New SureCart Product', 'surecart' ),
					'edit_item'                => __( 'Edit SureCart Product', 'surecart' ),
					'view_item'                => __( 'View SureCart Product', 'surecart' ),
					'all_items'                => __( 'All SureCart Products', 'surecart' ),
					'search_items'             => __( 'Search SureCart Products', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'SureCart Products list navigation', 'surecart' ),
					'items_list'               => __( 'SureCart Products list', 'surecart' ),
					'item_published'           => __( 'SureCart Product published.', 'surecart' ),
					'item_published_privately' => __( 'SureCart Product published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'SureCart Product reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'SureCart Product scheduled.', 'surecart' ),
					'item_updated'             => __( 'SureCart Product updated.', 'surecart' ),
				),
				'hierarchical'      => true,
				'public'            => true,
				'show_ui'           => true,
				'show_in_menu'      => true,
				'rewrite'           => [
					'slug'       => 'products-new',
					'with_front' => false,
				],
				'show_in_rest'      => false,
				'show_in_nav_menus' => false,
				'can_export'        => false,
				'capability_type'   => 'post',
				'map_meta_cap'      => true,
				'supports'          => array(
					'title',
					'editor',
					'excerpt',
					'custom-fields',
				),
			)
		);
	}
}
