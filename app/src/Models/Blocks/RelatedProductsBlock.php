<?php

namespace SureCart\Models\Blocks;

/**
 * The product list block.
 */
class RelatedProductsBlock extends AbstractProductListBlock {
	/**
	 * The cached query result.
	 *
	 * @var \WP_Query|null
	 */
	protected static $cached_query = null;

	/**
	 * Build the query.
	 *
	 * @param array $include_term_ids The term ids to include in the query.
	 *
	 * @return array
	 */
	public function parse_query( $include_term_ids = [] ) {
		global $wpdb;

		$per_page         = $this->getQueryAttribute( 'perPage', 15 );
		$total_pages      = $this->getQueryAttribute( 'pages', 3 );
		$exclude_term_ids = $this->getQueryAttribute( 'exclude_term_ids', [] );

		$query = array(
			'fields' => "
				SELECT DISTINCT ID FROM {$wpdb->posts} p
			",
			'join'   => '',
			'where'  => "
				WHERE 1=1
				AND p.post_status = 'publish'
				AND p.post_type = 'sc_product'
			",
			'limits' => '
				LIMIT ' . absint( apply_filters( 'surecart_product_related_posts_query_limit', ( $per_page * $total_pages ) + 10 ) ) . '
			',
		);

		if ( count( $exclude_term_ids ) ) {
			$query['join']  .= " LEFT JOIN ( SELECT object_id FROM {$wpdb->term_relationships} WHERE term_taxonomy_id IN ( " . implode( ',', array_map( 'absint', $exclude_term_ids ) ) . ' ) ) AS exclude_join ON exclude_join.object_id = p.ID';
			$query['where'] .= ' AND exclude_join.object_id IS NULL';
		}

		if ( count( $include_term_ids ) ) {
			$query['join'] .= " INNER JOIN ( SELECT object_id FROM {$wpdb->term_relationships} INNER JOIN {$wpdb->term_taxonomy} using( term_taxonomy_id ) WHERE term_id IN ( " . implode( ',', array_map( 'absint', $include_term_ids ) ) . ' ) ) AS include_join ON include_join.object_id = p.ID';
		}

		return $query;
	}

	/**
	 * Run the query.
	 *
	 * This first gets post ids based on shared object terms.
	 * Then it creates a WP_Query object with the post ids.
	 *
	 * @return $this|\WP_Error
	 */
	public function query() {
		// Return cached query if it exists.
		if ( null !== self::$cached_query ) {
			$this->query = self::$cached_query;
			return $this;
		}

		global $wpdb;

		$page     = $this->url->getCurrentPage();
		$per_page = $this->getQueryAttribute( 'perPage', 3 );
		$order    = $this->getQueryAttribute( 'order', 'desc' );
		$orderby  = $this->getQueryAttribute( 'orderBy', 'date' );
		$taxonomy = $this->getQueryAttribute( 'taxonomy', 'sc_collection' );

		// get the current posts terms.
		$term_ids = wp_get_object_terms(
			get_the_ID(),
			$taxonomy,
			[ 'fields' => 'ids' ]
		);

		// If there are term ids, get the post ids.
		if ( ! empty( $term_ids ) && ! is_wp_error( $term_ids ) ) {
			$query = $this->parse_query( $term_ids );
			// phpcs:ignore WordPress.VIP.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.NotPrepared
			$post_ids = $wpdb->get_col( implode( ' ', (array) apply_filters( 'surecart_product_related_posts_query', $query, get_the_ID() ) ) );

			// Maybe shuffle the post ids. We don't want to shuffle if there are more posts than the per page limit.
			// This is because shuffle does not work with pagination.
			if ( ! $this->has_pagination ) {
				if ( $this->getQueryAttribute( 'shuffle', false ) ) {
					shuffle( $post_ids );
				}
			}
		}

		// If there are no related products, show all products.
		$fallback_to_all = $this->getQueryAttribute( 'fallback', true );

		// Exclude the current post ID.
		$post_in = array_diff(
			! empty( $post_ids ) ? array_map( 'absint', $post_ids ) : ( ! $fallback_to_all ? [ 0 ] : [] ),
			[ get_the_ID() ]
		);

		// Create WP_Query object with found post IDs.
		$this->query = new \WP_Query(
			apply_filters(
				'surecart_related_products_query_args',
				[
					'post_type'      => 'sc_product',
					'post__in'       => $post_in, // Use 0 to return no results if empty.
					'orderby'        => esc_sql( $orderby ),
					'post_status'    => 'publish',
					'order'          => esc_sql( $order ),
					'posts_per_page' => absint( $per_page ),
					'paged'          => absint( $page ),
					'post__not_in'   => [ get_the_ID() ],
				],
			)
		);

		// Cache the query result.
		self::$cached_query = $this->query;

		// return the query.
		return $this;
	}
}
