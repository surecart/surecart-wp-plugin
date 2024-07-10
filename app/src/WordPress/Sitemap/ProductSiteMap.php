<?php
/**
 * Sitemaps: ProductSiteMap class
 *
 * Builds the sitemaps for our product object type.
 */

namespace SureCart\WordPress\Sitemap;

/**
 * Product XML sitemap provider.
 */
class ProductSiteMap extends \WP_Sitemaps_Provider {
	/**
	 * WP_Sitemaps_Users constructor.
	 */
	public function __construct() {
		$this->name        = 'products';
		$this->object_type = 'product';
	}

	/**
	 * Gets a URL list for a user sitemap.
	 *
	 * @param int    $page_num       Page of results.
	 * @param string $object_subtype Optional. Not applicable for Users but
	 *                               required for compatibility with the parent
	 *                               provider class. Default empty.
	 * @return array[] Array of URL information for a sitemap.
	 */
	public function get_url_list( $page_num, $object_subtype = '' ) {
		$args          = $this->get_product_query_args();
		$args['paged'] = $page_num;
		$query         = new \WP_Query( $args );
		$url_list      = array();

		foreach ( $query->posts as $post ) {
			$sitemap_entry = array(
				'loc'     => get_permalink( $post ),
				'lastmod' => wp_date( DATE_W3C, strtotime( $post->post_modified_gmt ) ),
			);

			/**
			 * Filters the sitemap entry for an individual product.
			 *
			 * @param array   $sitemap_entry Sitemap entry for the user.
			 * @param \WP_Post               object.
			 */
			$sitemap_entry = apply_filters( 'wp_sitemaps_sc_products_entry', $sitemap_entry, $post );
			$url_list[]    = $sitemap_entry;
		}

		return $url_list;
	}

	/**
	 * Gets the max number of pages available for the object type.
	 *
	 * @see WP_Sitemaps_Provider::max_num_pages
	 *
	 * @param string $object_subtype Optional. Not applicable for Users but
	 *                               required for compatibility with the parent
	 *                               provider class. Default empty.
	 * @return int Total page count.
	 */
	public function get_max_num_pages( $object_subtype = '' ) {
		/**
		 * Filters the max number of pages for a user sitemap before it is generated.
		 *
		 * Returning a non-null value will effectively short-circuit the generation,
		 * returning that value instead.
		 *
		 * @param int|null $max_num_pages The maximum number of pages. Default null.
		 */
		$max_num_pages = apply_filters( 'wp_sitemaps_sc_products_pre_max_num_pages', null );

		if ( null !== $max_num_pages ) {
			return $max_num_pages;
		}

		$args           = $this->get_product_query_args();
		$args['fields'] = 'ids';
		$query          = new \WP_Query( $args );

		return $query->max_num_pages;
	}

	/**
	 * Gets the post query arguments for the sitemap.
	 *
	 * @return array Query arguments.
	 */
	private function get_product_query_args() {
		return apply_filters(
			'wp_sitemaps_sc_products_query_args',
			array(
				'post_type'              => 'sc_product',
				'post_status'            => 'publish',
				'posts_per_page'         => wp_sitemaps_get_max_urls( $this->object_type ),
				'orderby '               => 'ID',
				'order'                  => 'ASC',
				'update_post_term_cache' => false,
				'update_post_meta_cache' => false,
				'ignore_sticky_posts'    => true,
			)
		);
	}
}
