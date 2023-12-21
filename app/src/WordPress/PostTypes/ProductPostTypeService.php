<?php

namespace SureCart\WordPress\PostTypes;

use SureCart\Models\Product;
use SureCart\Models\ProductMedia;

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
		// register.
		add_action( 'init', [ $this, 'registerPostType' ] );
		// add child posts to posts results to prevent n+1 queries.
		add_action( 'posts_results', [ $this, 'addChildrenToProducts' ], 10, 2 );
		// add necessary data to product.
		add_action( 'the_post', [ $this, 'addChildrenToProduct' ], 10, 2 );
		// register post status.
		add_action( 'init', [ $this, 'registerPostStatus' ] );
		// add the rest api meta query.
		add_action( "rest_{$this->post_type}_query", [ $this, 'addMetaQuery' ], 10, 2 );
		// register rest fields.
		add_action( 'rest_api_init', [ $this, 'registerRestFields' ] );
		// when gallery is updated on the post, set the first as the featured image.
		add_action( 'updated_post_meta', [ $this, 'automaticallySetFeaturedImage' ], 10, 4 );
	}

	/**
	 * When the gallery post meta is updated, automatically make the first item the featured image.
	 *
	 * @param integer $meta_id The meta ID.
	 * @param integer $post_id The post ID.
	 * @param string  $meta_key The meta key.
	 * @param mixed   $meta_value The meta value.
	 *
	 * @return void
	 */
	public function automaticallySetFeaturedImage( $meta_id, $post_id, $meta_key, $meta_value ) {
		// get the post.
		$post = get_post( $post_id );

		// if the surecart id is missing.
		if ( empty( $post->sc_id ) ) {
			return;
		}

		// check it's our data.
		if ( get_post_type( $post ) !== $this->post_type || 'gallery' !== $meta_key ) {
			return;
		}

		// check data integrity.
		if ( ! is_array( $meta_value ) || empty( $meta_value[0] ) ) {
			return;
		}

		// TODO: Check for image type before setting as featured image.

		// set the post thumbnail.
		set_post_thumbnail( $post_id, $meta_value[0] );

		// get the attachment url.
		$attachment_url = wp_get_attachment_url( $meta_value[0] );

		// if the attachment url is missing.
		if ( empty( $attachment_url ) ) {
			throw new \Exception( 'Attachment URL is missing.' );
		}

		$product = Product::find( $post->sc_id );
		if ( is_wp_error( $product ) ) {
			throw new \Exception( $product->get_error_message() );
		}

		if ( ! empty( $product->featured_product_media ) ) {
			$updated = ProductMedia::update(
				[
					'id'       => $product->featured_product_media,
					'url'      => $attachment_url,
					'media_id' => null, // make sure to clear the media id.
					'position' => 0,
				]
			);
			if ( is_wp_error( $updated ) ) {
				throw new \Exception( $updated->get_error_message() );
			}
		} else {
			$created = ProductMedia::create(
				[
					'url'      => $attachment_url,
					'product'  => $product->id,
					'media_id' => null,
				]
			);
			if ( is_wp_error( $created ) ) {
				throw new \Exception( $created->get_error_message() );
			}
		}
	}

	/**
	 * Register the rest fields.
	 *
	 * @return void
	 */
	public function registerRestFields() {
		register_rest_field(
			$this->post_type,
			'gallery',
			[
				'get_callback'    => function( $post ) {
					return ! empty( get_post_meta( $post['id'], 'gallery', true ) ) ? get_post_meta( $post['id'], 'gallery', true ) : [];
				},
				'update_callback' => function( $value, $post ) {
					return update_post_meta( $post->ID, 'gallery', $value );
				},
				'schema'          => [
					'description' => __( 'Product gallery', 'surecart' ),
					'type'        => 'array',
					'items'       => [
						'type' => 'integer',
					],
				],
			]
		);
	}

	/**
	 * Add the sc_id meta query to the REST API request.
	 *
	 * @param array            $args   The args.
	 * @param \WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function addMetaQuery( $args, $request ) {
		if ( ! empty( $request['sc_id'] ) ) {
			$args['meta_query'][]   = [
				'key'   => 'id',
				'value' => $request['sc_id'],
			];
			$args['post_status']    = [ 'auto-draft', 'draft', 'publish', 'trash', 'sc_archived' ];
			$args['posts_per_page'] = 1;
			$args['no_found_rows']  = true;
		}
		return $args;
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
					'orderby'         => 'menu_order',
					'order'           => 'ASC',
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
			// set global product.
			global $sc_product;
			$sc_product = sc_get_product( $post );

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
					'orderby'        => 'menu_order',
					'order'          => 'ASC',
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
				'show_in_rest'      => true,
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

	/**
	 * Register the archived post status for all post types.
	 *
	 * @return void
	 */
	public function registerPostStatus() {
		register_post_status(
			'sc_archived',
			array(
				'label'                     => _x( 'Archived', 'post', 'surecart' ),
				'public'                    => false,
				'exclude_from_search'       => true,
				'show_in_admin_all_list'    => true,
				'show_in_admin_status_list' => true,
				'private'                   => true,
				'show_in_admin_all_list'    => true,
				'show_in_admin_status_list' => true,
				// translators: %s: number of posts.
				'label_count'               => _n_noop( 'Archived <span class="count">(%s)</span>', 'Archived <span class="count">(%s)</span>', 'surecart' ),
			)
		);
	}
}
