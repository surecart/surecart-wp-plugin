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
		// add varition option value query to posts_where.
		add_filter( 'posts_where', [ $this, 'handleVariationOptionValueQuery' ], 10, 2 );
		// add global $sc_product inside loops.
		add_action( 'the_post', [ $this, 'setupData' ] );
		// register post status.
		add_action( 'init', [ $this, 'registerPostStatus' ] );
		// add the rest api meta query.
		add_action( "rest_{$this->post_type}_query", [ $this, 'addMetaQuery' ], 10, 2 );
		// register rest fields.
		add_action( 'rest_api_init', [ $this, 'registerRestFields' ] );

		add_action(
			'get_post_metadata',
			[ $this, 'migrateDefaultGalleryMetaData' ],
			10,
			4
		);
		// when gallery is updated on the post, set the first as the featured image.
		// add_action( 'updated_post_meta', [ $this, 'automaticallySetFeaturedImage' ], 10, 4 );
		// add the external media url.
		// add_filter( 'wp_get_attachment_image_src', [ $this, 'externalMediaUrl' ], 10, 3 );
		// add the external media metadata.
		// add_action( 'wp_get_attachment_metadata', [ $this, 'externalAttachmentMetaData' ], 10, 2 );
		// when a product media is deleted, remove it from the gallery.
		// add_action( 'delete_attachment', [ $this, 'removeFromGallery' ], 10, 1 );
	}

	public function migrateDefaultGalleryMetaData( $value, $object_id, $meta_key, $single ) {
		// only for gallery.
		if ( 'gallery' !== $meta_key ) {
			return $value;
		}

		// only for our post type.
		if ( get_post_type( $object_id ) !== $this->post_type ) {
			return;
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
	public function setupData( $post ) {
			// unset existing globals.
		unset( $GLOBALS['sc_product'] );

		// get post.
		if ( is_int( $post ) ) {
			$post = get_post( $post );
		}

		// check post type.
		if ( empty( $post->post_type ) || 'sc_product' !== $post->post_type ) {
			return;
		}

		// set product.
		$GLOBALS['sc_product'] = sc_get_product( $post );

		// return product.
		return $GLOBALS['sc_product'];
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
	 * Add the external media metadata.
	 *
	 * @param mixed  $data          The data.
	 * @param string $attachment_id     The object ID.
	 *
	 * @return mixed
	 */
	public function externalAttachmentMetaData( $data, $attachment_id ) {
		// TODO: check to make sure it's surecart.

		$source_url = get_post_meta( $attachment_id, '_source_url', true );

		$sizes = wp_get_registered_image_subsizes();

		foreach ( $sizes as $name => $size ) {
			$width  = $size['width'] ?? null;
			$height = $size['height'] ?? null;

			if ( strpos( $source_url, 'media.surecart.com' ) !== false ) {
				$source_url = 'https://surecart.com/cdn-cgi/image/fit=' . ( $size['crop'] ? 'crop' : 'scale-down' ) . ',format=auto,width=' . $width . ',height=' . $height . '/' . $source_url;
			}

			$data['sizes'][ $name ] = [
				'file'       => $source_url,
				'width'      => $width,
				'height'     => $height,
				'source_url' => $source_url,
			];
		}

		return $data;
	}

	/**
	 * Add the external media url.
	 *
	 * @param array   $image The image.
	 * @param integer $id    The ID.
	 * @param array   $size  The size.
	 *
	 * @return array
	 */
	public function externalMediaUrl( $image, $id, $size ) {
		// get the post.
		$source_url = get_post_meta( $id, '_source_url', true );

		// not a surecart image.
		if ( strpos( $source_url, 'media.surecart.com' ) === false ) {
			return $image;
		}

		if ( is_string( $size ) ) {
			$sizes = wp_get_registered_image_subsizes();

			if ( isset( $sizes[ $size ] ) ) {
				$size = [
					$sizes[ $size ]['width'],
					$sizes[ $size ]['height'],
				];
			} else {
				$size = [
					null,
					null,
				];
			}
		}

		return [
			'https://surecart.com/cdn-cgi/image/fit=crop,format=auto,width=' . $size[0] . ',height=' . $size[1] . '/' . $source_url,
			$size[0],
			$size[1],
		];
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

		// check it's our data .
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

		return false;

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
