<?php

namespace SureCart\WordPress\PostTypes;

use SureCart\Models\Form;
use SureCart\WordPress\Pages\PageService;

/**
 * Form post type service class.
 */
class ProductPostTypeService {
	/**
	 * Holds the page service
	 *
	 * @var PageService
	 */
	protected $page_service;

	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'sc-product';

	/**
	 * Get the page service from the application container.
	 *
	 * @param PageService $page_service Page serice.
	 */
	public function __construct( PageService $page_service ) {
		$this->page_service = $page_service;
	}

	/**
	 * Get the post type.
	 *
	 * @return string
	 */
	public function getPostType() {
		return $this->post_type;
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerPostType' ] );
	}

	/**
	 * Create the post.
	 *
	 * @param array  $postarr {
	 *      An array of elements that make up a post to update or insert.
	 *
	 *     @type int    $ID                    The post ID. If equal to something other than 0,
	 *                                         the post with that ID will be updated. Default 0.
	 *     @type int    $post_author           The ID of the user who added the post. Default is
	 *                                         the current user ID.
	 *     @type string $post_date             The date of the post. Default is the current time.
	 *     @type string $post_date_gmt         The date of the post in the GMT timezone. Default is
	 *                                         the value of `$post_date`.
	 *     @type string $post_content          The post content. Default empty.
	 *     @type string $post_content_filtered The filtered post content. Default empty.
	 *     @type string $post_title            The post title. Default empty.
	 *     @type string $post_excerpt          The post excerpt. Default empty.
	 *     @type string $post_status           The post status. Default 'draft'.
	 *     @type string $post_type             The post type. Default 'post'.
	 *     @type string $comment_status        Whether the post can accept comments. Accepts 'open' or 'closed'.
	 *                                         Default is the value of 'default_comment_status' option.
	 *     @type string $ping_status           Whether the post can accept pings. Accepts 'open' or 'closed'.
	 *                                         Default is the value of 'default_ping_status' option.
	 *     @type string $post_password         The password to access the post. Default empty.
	 *     @type string $post_name             The post name. Default is the sanitized post title
	 *                                         when creating a new post.
	 *     @type string $to_ping               Space or carriage return-separated list of URLs to ping.
	 *                                         Default empty.
	 *     @type string $pinged                Space or carriage return-separated list of URLs that have
	 *                                         been pinged. Default empty.
	 *     @type string $post_modified         The date when the post was last modified. Default is
	 *                                         the current time.
	 *     @type string $post_modified_gmt     The date when the post was last modified in the GMT
	 *                                         timezone. Default is the current time.
	 *     @type int    $post_parent           Set this for the post it belongs to, if any. Default 0.
	 *     @type int    $menu_order            The order the post should be displayed in. Default 0.
	 *     @type string $post_mime_type        The mime type of the post. Default empty.
	 *     @type string $guid                  Global Unique ID for referencing the post. Default empty.
	 *     @type int    $import_id             The post ID to be used when inserting a new post.
	 *                                         If specified, must not match any existing post ID. Default 0.
	 *     @type int[]  $post_category         Array of category IDs.
	 *                                         Defaults to value of the 'default_category' option.
	 *     @type array  $tags_input            Array of tag names, slugs, or IDs. Default empty.
	 *     @type array  $tax_input             An array of taxonomy terms keyed by their taxonomy name.
	 *                                         If the taxonomy is hierarchical, the term list needs to be
	 *                                         either an array of term IDs or a comma-separated string of IDs.
	 *                                         If the taxonomy is non-hierarchical, the term list can be an array
	 *                                         that contains term names or slugs, or a comma-separated string
	 *                                         of names or slugs. This is because, in hierarchical taxonomy,
	 *                                         child terms can have the same names with different parent terms,
	 *                                         so the only way to connect them is using ID. Default empty.
	 *     @type array  $meta_input            Array of post meta values keyed by their post meta key. Default empty.
	 * }
	 * @param string $product_id  The product id to associate the post with.
	 * @param bool   $wp_error         Optional. Whether to return a WP_Error on failure. Default false.
	 * @param bool   $fire_after_hooks Optional. Whether to fire the after insert hooks. Default true.
	 * @return int|WP_Error The post ID on success. The value 0 or WP_Error on failure.
	 */
	public function create( $postarr = [], $product_id, $wp_error = false, $fire_after_hooks = true ) {
		return wp_insert_post(
			array_merge(
				$postarr,
				[
					'post_type'  => $this->post_type,
					'meta_input' => [
						'sc_product_id' => $product_id,
					],
				]
			),
			$wp_error,
			$fire_after_hooks
		);
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
				'labels'            => array(
					'name'                     => _x( 'Product Pages', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'Product Page', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'Product', 'surecart' ),
					'add_new_item'             => __( 'Add New Product Page', 'surecart' ),
					'new_item'                 => __( 'New Product Page', 'surecart' ),
					'edit_item'                => __( 'Edit Product Page', 'surecart' ),
					'view_item'                => __( 'View Product Page', 'surecart' ),
					'all_items'                => __( 'All Product Pages', 'surecart' ),
					'search_items'             => __( 'Search Product Pages', 'surecart' ),
					'not_found'                => __( 'No product pages found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No product pages found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter product pages list', 'surecart' ),
					'items_list_navigation'    => __( 'Product pages list navigation', 'surecart' ),
					'items_list'               => __( 'Product pages list', 'surecart' ),
					'item_published'           => __( 'Product page published.', 'surecart' ),
					'item_published_privately' => __( 'Product page published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'Product page reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'Product page scheduled.', 'surecart' ),
					'item_updated'             => __( 'Product page updated.', 'surecart' ),
				),
				'public'            => true,
				'show_ui'           => true,
				'show_in_admin_bar' => true,
				'show_in_menu'      => false, // remove from menu.
				'rewrite'           => [
					'slug'       => 'product',
					'with_front' => false,
				],
				'show_in_rest'      => true,
				'rest_base'         => 'sc-products',
				'map_meta_cap'      => true,
				'has_archive'       => true,
				'supports'          => array(
					'editor',
					'custom-fields', // todo: maybe remove.
					'revisions',
					'page-attributes',
				),
			)
		);
	}
}
