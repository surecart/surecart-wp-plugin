<?php

namespace SureCart\WordPress\PostTypes;

/**
 * Batch-loads product image posts into the WordPress object cache.
 *
 * Collects all attachment/post IDs referenced by product images (thumbnails
 * and gallery items) and loads them in a single DB query, eliminating N+1
 * queries when rendering product lists.
 */
class ProductAttachmentsCachePrimerService {
	/**
	 * Post IDs already primed within the current request.
	 *
	 * @var array<int, true>
	 */
	protected $primed_ids = [];

	/**
	 * Prime the object cache for all image-related post IDs in the given products.
	 *
	 * @param \WP_Post[] $posts The product posts from a WP_Query result.
	 */
	public function prime( array $posts ) {
		if ( empty( $posts ) ) {
			return;
		}

		$post_ids     = $this->collectImagePostIds( $posts );
		$uncached_ids = $this->filterUncachedIds( $post_ids );

		if ( ! empty( $uncached_ids ) ) {
			$this->warmPostCaches( $uncached_ids );
		}
	}

	/**
	 * Collect all post IDs referenced by product images.
	 *
	 * @param \WP_Post[] $posts The product posts.
	 *
	 * @return int[]
	 */
	public function collectImagePostIds( array $posts ) {
		$ids = [];

		foreach ( $posts as $post ) {
			// Featured image (thumbnail) ID.
			$thumbnail_id = get_post_meta( $post->ID, '_thumbnail_id', true );
			if ( ! empty( $thumbnail_id ) && is_numeric( $thumbnail_id ) ) {
				$ids[] = (int) $thumbnail_id;
			}

			// Gallery IDs from product metadata.
			$gallery_ids = $this->getGalleryIdsFromPost( $post );
			foreach ( $gallery_ids as $gallery_item ) {
				$id = $this->extractNumericId( $gallery_item );
				if ( $id ) {
					$ids[] = $id;
				}
			}
		}

		return $ids;
	}

	/**
	 * Get gallery_ids array from a product post's metadata.
	 *
	 * @param \WP_Post $post The product post.
	 *
	 * @return array
	 */
	public function getGalleryIdsFromPost( $post ) {
		$product_data = get_post_meta( $post->ID, 'product', true );
		if ( empty( $product_data ) ) {
			return [];
		}

		if ( is_string( $product_data ) ) {
			$product_data = json_decode( $product_data );
		} elseif ( is_array( $product_data ) ) {
			$product_data = json_decode( wp_json_encode( $product_data ) );
		}

		$gallery_ids = $product_data->metadata->gallery_ids ?? '';

		if ( is_string( $gallery_ids ) ) {
			$gallery_ids = json_decode( $gallery_ids, true );
		}

		return is_array( $gallery_ids ) ? $gallery_ids : [];
	}

	/**
	 * Extract a numeric post ID from a gallery item.
	 *
	 * Gallery items can be plain integers, arrays with an 'id' key,
	 * or objects with an 'id' property. String IDs (ProductMedia) are skipped.
	 *
	 * @param mixed $gallery_item The gallery item.
	 *
	 * @return int|null The numeric ID or null.
	 */
	public function extractNumericId( $gallery_item ) {
		if ( is_numeric( $gallery_item ) ) {
			return (int) $gallery_item;
		}

		if ( is_array( $gallery_item ) && isset( $gallery_item['id'] ) && is_numeric( $gallery_item['id'] ) ) {
			return (int) $gallery_item['id'];
		}

		if ( is_object( $gallery_item ) && isset( $gallery_item->id ) && is_numeric( $gallery_item->id ) ) {
			return (int) $gallery_item->id;
		}

		return null;
	}

	/**
	 * Filter out IDs that are already in the object cache.
	 *
	 * Tracks primed IDs within the current request to prevent duplicate work
	 * across multiple block instances.
	 *
	 * @param int[] $post_ids The post IDs to filter.
	 *
	 * @return int[]
	 */
	public function filterUncachedIds( array $post_ids ) {
		$uncached_ids = [];

		foreach ( array_unique( $post_ids ) as $id ) {
			if ( ! isset( $this->primed_ids[ $id ] ) && ! wp_cache_get( $id, 'posts' ) ) {
				$uncached_ids[]          = $id;
				$this->primed_ids[ $id ] = true;
			}
		}

		return $uncached_ids;
	}

	/**
	 * Batch-load posts and their metadata into the WordPress object cache.
	 *
	 * Uses direct $wpdb query to bypass WP_Query's post_status filtering,
	 * which excludes custom statuses (e.g. sc_archived) even with 'any'.
	 *
	 * @param int[] $ids The post IDs to cache.
	 */
	public function warmPostCaches( array $ids ) {
		global $wpdb;

		$id_placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );

		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$posts = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE ID IN ($id_placeholders)", $ids ) );

		if ( empty( $posts ) ) {
			return;
		}

		foreach ( $posts as $post ) {
			$post = sanitize_post( $post, 'raw' );
			wp_cache_add( $post->ID, $post, 'posts' );
		}

		update_meta_cache( 'post', wp_list_pluck( $posts, 'ID' ) );
	}
}
