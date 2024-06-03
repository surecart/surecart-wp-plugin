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
		// register.
		add_action( 'init', [ $this, 'registerPostType' ] );

		// register post status.
		add_action( 'init', [ $this, 'registerPostStatus' ] );

		// add variation option value query to posts_where.
		add_filter( 'posts_where', [ $this, 'handleVariationOptionValueQuery' ], 10, 2 );

		// ensure we always fetch with the current connected store id in case of store change.
		add_filter( 'parse_query', [ $this, 'forceAccountIdScope' ], 10, 2 );

		// add global $sc_product inside loops.
		add_action( 'the_post', [ $this, 'setupData' ] );

		// add the rest api meta query.
		add_action( "rest_{$this->post_type}_query", [ $this, 'addMetaQuery' ], 10, 2 );

		// register rest fields.
		add_action( 'rest_api_init', [ $this, 'registerRestFields' ] );

		// product gallery migration.
		add_action( 'get_post_metadata', [ $this, 'defaultGalleryFallback' ], 10, 4 );

		// add_filter(
		// 'query_vars',
		// function( $vars ) {
		// $vars[] = 'variant_options';
		// return $vars;
		// }
		// );

		// update edit post link to edit the product directly.
		// add_filter( 'get_edit_post_link', [ $this, 'updateEditPostLink' ], 10, 2 );

		// when a product media is deleted, remove it from the gallery.
		add_action( 'delete_attachment', [ $this, 'removeFromGallery' ], 10, 1 );

		// handle classic themes template.
		if ( ! wp_is_block_theme() ) {
			// replace the content with product info part.
			add_filter( 'the_content', [ $this, 'replaceContentWithProductInfoPart' ], 10 );
		}
	}

	/**
	 * Update the edit post link to edit the product directly.
	 *
	 * @param string  $link     The link.
	 * @param integer $post_id  The post ID.
	 *
	 * @return string
	 */
	public function updateEditPostLink( $link, $post_id ) {
		// only for our post type.
		if ( get_post_type( $post_id ) !== $this->post_type ) {
			return $link;
		}

		// get the product.
		$product = sc_get_product( $post_id );

		// if we have a product, return the edit link.
		if ( ! empty( $product ) ) {
			return \SureCart::getUrl()->edit( 'product', $product->id );
		}

		return $link;
	}

	/**
	 * For classic themes, replace the content with the product info template.
	 *
	 * @param string $content The content.
	 *
	 * @return string
	 */
	public function replaceContentWithProductInfoPart( $content ) {
		if ( ! is_singular( 'sc_product' ) ) {
			return $content;
		}
		if ( ! empty( $content ) ) {
			return $content;
		}
		$template_part_id = 'surecart/surecart//product-info'; // Get the template part ID.
		$blocks           = get_block_template( $template_part_id, 'wp_template_part' )->content;
		$blocks           = shortcode_unautop( $blocks );
		$blocks           = do_shortcode( $blocks );
		$blocks           = do_blocks( $blocks );
		$blocks           = wptexturize( $blocks );
		$blocks           = convert_smilies( $blocks );
		$blocks           = wp_filter_content_tags( $blocks, 'template_part_uncategorized' );
		// Handle embeds for block template parts.
		global $wp_embed;
		$blocks = $wp_embed->autoembed( $blocks );
		$blocks = str_replace( ']]>', ']]&gt;', $blocks );
		return $blocks . $content;
	}

	/**
	 * Default gallery fallback.
	 *
	 * Because the gallery metadata has not yet been saved, pull in the product media
	 * as the gallery.
	 *
	 * @param array   $value  The value.
	 * @param integer $object_id The object ID.
	 * @param string  $meta_key The meta key.
	 * @param bool    $single Whether to return a single value.
	 *
	 * @return array|mixed;
	 */
	public function defaultGalleryFallback( $value, $object_id, $meta_key, $single ) {
		// only for gallery.
		if ( 'gallery' !== $meta_key ) {
			return $value;
		}

		// only for our post type.
		if ( get_post_type( $object_id ) !== $this->post_type ) {
			return $value;
		}

		// only if empty.
		remove_filter( 'get_post_metadata', [ $this, __FUNCTION__ ], 10 );
		$has_meta = get_post_meta( $object_id, $meta_key, true );
		add_filter( 'get_post_metadata', [ $this, __FUNCTION__ ], 10, 4 );
		if ( ! empty( $has_meta ) ) {
			return $value;
		}

		// get the synced product.
		$product = sc_get_product( $object_id );

		// push the existing media to the gallery.
		return [
			array_filter(
				array_map(
					function( $media ) {
						return (object) [
							'id' => $media->id,
						];
					},
					$product->product_medias->data ?? []
				)
			),
		];
	}

	/**
	 * Setup the product.
	 *
	 * @param \WP_Post $post The post.
	 *
	 * @return void
	 */
	public function setupData( $post = '' ) {
		// get post.
		$post = get_post( $post );

		// check post type.
		if ( empty( $post->post_type ) || 'sc_product' !== $post->post_type ) {
			return;
		}

		// unset existing globals.
		unset( $GLOBALS['sc_product'] );

		// set product.
		$GLOBALS['sc_product'] = sc_get_product( $post );

		// return product.
		return $GLOBALS['sc_product'];
	}

	/**
	 * Force the account id scope.
	 *
	 * @param \WP_Query $query The query.
	 *
	 * @return \WP_Query
	 */
	public function forceAccountIdScope( $query ) {
		// not our post type.
		if ( $query->get( 'post_type' ) !== 'sc_product' ) {
			return $query;
		}

		// add to tax_query.
		if ( \SureCart::account()->id ) {
			// get existing tax_query.
			$existing = is_array( $query->get( 'tax_query' ) ) && ! empty( $query->get( 'tax_query' ) ) ? $query->get( 'tax_query' ) : [];

			// set the tax query using account.
			$query->set(
				'tax_query',
				array_merge(
					[
						'relation' => 'AND',
						[
							'taxonomy' => 'sc_account',
							'field'    => 'name',
							'terms'    => \SureCart::account()->id,
						],
					],
					$existing,
				),
			);
		}

		return $query;
	}

	/**
	 * Handle the variation option value query.
	 *
	 * @param string   $where The WHERE clause of the query.
	 * @param WP_Query $query The WP_Query instance (passed by reference).
	 *
	 * @return string
	 */
	public function handleVariationOptionValueQuery( $where, $query ) {
		global $wpdb;

		// not our post type.
		if ( $query->get( 'post_type' ) !== 'sc_product' ) {
			return $where;
		}

		// not our query.
		$variant_query = $query->get( 'variant_options' );
		if ( empty( $variant_query ) ) {
			return $where;
		}

		// the relation.
		$relation = $variant_query['relation'] ?? 'AND';

		// add each query.
		foreach ( $variant_query as $query ) {
			// not a valid query.
			if ( ! is_array( $query ) ) {
				continue;
			}
			// get our table.
			$option_value_table = $wpdb->prefix . 'surecart_variant_option_values';
			// get values.
			$values = "'" . implode( "','", $query['values'] ) . "'";
			// get operator.
			$operator = $query['operator'] ?? 'IN';
			// add the where clause.
			$where .= " $relation {$wpdb->posts}.ID IN (SELECT post_id FROM {$option_value_table} WHERE value $operator ($values) AND name = '{$query['name']}')";
		}

		return $where;
	}

	/**
	 * When a product media is deleted, remove it from the gallery.
	 *
	 * @param integer $post_id The post ID.
	 *
	 * @return void
	 */
	public function removeFromGallery( $post_id ) {
		// get the post.
		$post = get_post( $post_id );

		// if the post is not a product media.
		if ( 'attachment' !== $post->post_type ) {
			return;
		}

		// get the gallery.
		$gallery = get_post_meta( $post->post_parent, 'gallery', true );

		// if the gallery is empty.
		if ( empty( $gallery ) ) {
			return;
		}

		// remove the post id from the gallery.
		$updated = array_filter(
			$gallery,
			function( $id ) use ( $post_id ) {
				return $id !== $post_id;
			}
		);

		// update the gallery.
		update_post_meta( $post->post_parent, 'gallery', $updated );
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
					// map each value to an object.
					$value = array_map(
						function( $item ) {
							return (object) $item;
						},
						$value
					);
					return update_post_meta( $post->ID, 'gallery', $value );
				},
				'schema'          => [
					'description' => __( 'Product gallery', 'surecart' ),
					'type'        => 'array',
					'items'       => [
						'type' => 'object',
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
				'key'   => 'sc_id',
				'value' => $request['sc_id'],
			];
			$args['post_status']    = [ 'auto-draft', 'draft', 'publish', 'trash', 'sc_archived' ];
			$args['posts_per_page'] = 1;
			$args['no_found_rows']  = true;
		}
		return $args;
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
					'name'                     => _x( 'Products', 'post type general name', 'surecart' ),
					'singular_name'            => _x( 'Product', 'post type singular name', 'surecart' ),
					'add_new'                  => _x( 'Add New', 'Product', 'surecart' ),
					'add_new_item'             => __( 'Add new Product', 'surecart' ),
					'new_item'                 => __( 'New Product', 'surecart' ),
					'edit_item'                => __( 'Edit Product', 'surecart' ),
					'view_item'                => __( 'View Product', 'surecart' ),
					'all_items'                => __( 'All Products', 'surecart' ),
					'search_items'             => __( 'Search Products', 'surecart' ),
					'not_found'                => __( 'No checkout forms found.', 'surecart' ),
					'not_found_in_trash'       => __( 'No checkout forms found in Trash.', 'surecart' ),
					'filter_items_list'        => __( 'Filter checkout forms list', 'surecart' ),
					'items_list_navigation'    => __( 'Products list navigation', 'surecart' ),
					'items_list'               => __( 'Products list', 'surecart' ),
					'item_published'           => __( 'Product published.', 'surecart' ),
					'item_published_privately' => __( 'Product published privately.', 'surecart' ),
					'item_reverted_to_draft'   => __( 'Product reverted to draft.', 'surecart' ),
					'item_scheduled'           => __( 'Product scheduled.', 'surecart' ),
					'item_updated'             => __( 'Product updated.', 'surecart' ),
				),
				'hierarchical'      => true,
				'public'            => true,
				'show_ui'           => true,
				'show_in_menu'      => true,
				'rewrite'           => [
					'slug'       => 'products',
					'with_front' => false,
				],
				'show_in_rest'      => true,
				'show_in_nav_menus' => false,
				'can_export'        => false,
				'capability_type'   => 'post',
				'map_meta_cap'      => true,
				'supports'          => array(
					'title',
					'excerpt',
					'custom-fields',
					'editor',
					'page-attributes',
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
