<?php

namespace SureCart\Models\Blocks;

/**
 * The product list block.
 */
class RelatedProductsBlock {
	/**
	 * The block.
	 *
	 * @var \WP_Block
	 */
	protected $block;

	/**
	 * The URL.
	 *
	 * @var object
	 */
	protected $url;

	/**
	 * The query.
	 *
	 * @var \WP_Query
	 */
	protected $query;

	/**
	 * The cached query result.
	 *
	 * @var \WP_Query|null
	 */
	protected static $cached_query = null;

	/**
	 * Constructor.
	 *
	 * @param \WP_Block $block The block.
	 */
	public function __construct( \WP_Block $block ) {
		$this->block = $block;
		$this->url   = \SureCart::block()->urlParams( 'products' );
	}

	/**
	 * Get the URL.
	 *
	 * @return object|null
	 */
	public function urlParams() {
		return $this->url;
	}

	/**
	 * Get the query context.
	 *
	 * @return array
	 */
	public function getQueryContext() {
		return $this->block->context['query'] ?? [];
	}

	/**
	 * Build the query.
	 *
	 * @return $this
	 */
	public function parse_query( $include_term_ids = [], $exclude_ids = [] ) {
		global $wpdb;

		$per_page         = absint( $this->block->parsed_block['attrs']['query']['perPage'] ?? $this->block->context['query']['perPage'] ?? 15 );
		$total_pages      = absint( $this->block->parsed_block['attrs']['query']['totalPages'] ?? $this->block->context['query']['totalPages'] ?? 3 );
		$exclude_term_ids = $this->block->parsed_block['attrs']['query']['exclude_term_ids'] ?? $this->block->context['query']['exclude_term_ids'] ?? [];

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
				LIMIT ' . absint( apply_filters( 'surecart_product_related_posts_query_limit', $per_page * $total_pages ) ) . '
			',
		);

		if ( count( $exclude_term_ids ) ) {
			$query['join']  .= " LEFT JOIN ( SELECT object_id FROM {$wpdb->term_relationships} WHERE term_taxonomy_id IN ( " . implode( ',', array_map( 'absint', $exclude_term_ids ) ) . ' ) ) AS exclude_join ON exclude_join.object_id = p.ID';
			$query['where'] .= ' AND exclude_join.object_id IS NULL';
		}

		if ( count( $include_term_ids ) ) {
			$query['join'] .= " INNER JOIN ( SELECT object_id FROM {$wpdb->term_relationships} INNER JOIN {$wpdb->term_taxonomy} using( term_taxonomy_id ) WHERE term_id IN ( " . implode( ',', array_map( 'absint', $include_term_ids ) ) . ' ) ) AS include_join ON include_join.object_id = p.ID';
		}

		if ( count( $exclude_ids ) ) {
			$query['where'] .= ' AND p.ID NOT IN ( ' . implode( ',', array_map( 'absint', $exclude_ids ) ) . ' )';
		}

		return $query;
	}

	/**
	 * Run the query
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

		// get the current posts terms.
		$term_ids = wp_get_object_terms(
			get_the_ID(),
			'sc_collection',
			[ 'fields' => 'ids' ]
		);

		$query = $this->parse_query( $term_ids, [ get_the_ID() ] );

		// phpcs:ignore WordPress.VIP.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.NotPrepared
		$post_ids = $wpdb->get_col( implode( ' ', (array) apply_filters( 'surecart_product_related_posts_query', $query, get_the_ID() ) ) );

		$page     = absint( $this->url->getCurrentPage() );
		$per_page = absint( $this->block->parsed_block['attrs']['query']['perPage'] ?? $this->block->parsed_block['attrs']['limit'] ?? $this->block->context['query']['perPage'] ?? 3 );

		// Maybe shuffle the post ids. We don't want to shuffle if there are more posts than the per page limit.
		// This is because shuffle does not work with pagination.
		if ( count( $post_ids ) <= $per_page ) {
			if ( $this->block->parsed_block['attrs']['query']['shuffle'] ?? $this->block->context['query']['shuffle'] ?? false ) {
				shuffle( $post_ids );
			}
		}

		// Create WP_Query object with found post IDs.
		$this->query = new \WP_Query(
			[
				'post_type'      => 'sc_product',
				'post__in'       => ! empty( $post_ids ) ? $post_ids : [ 0 ], // Use 0 to return no results if empty.
				'orderby'        => 'post__in',
				'posts_per_page' => absint( $per_page ),
				'paged'          => absint( $page ),
			]
		);

		// Cache the query result.
		self::$cached_query = $this->query;

		// return the query.
		return $this;
	}

	/**
	 * Get the query attribute.
	 *
	 * @param string $key The key.
	 * @return \WP_Query
	 */
	public function __get( $key ) {
		// handle pagination.
		if ( 'next_page_link' === $key ) {
			return $this->max_num_pages && $this->max_num_pages !== $this->paged ? $this->url->addPageArg( $this->paged + 1 )->url() : '';
		}

		if ( 'previous_page_link' === $key ) {
			return $this->paged > 1 ? $this->url->addPageArg( $this->paged - 1 )->url() : '';
		}

		if ( 'pagination_links' === $key ) {
			return array_map(
				function ( $i ) {
					return array(
						'href'    => $this->url->addPageArg( $i )->url(),
						'name'    => $i,
						'current' => (int) $i === (int) $this->paged,
					);
				},
				range( 1, $this->max_num_pages )
			);
		}

		if ( 'products' === $key ) {
			return array_map(
				function ( $post ) {
					return sc_get_product( $post );
				},
				$this->query->posts
			);
		}

		return $this->query->$key ?? $this->query->query[ $key ] ?? $this->query->query_vars[ $key ] ?? null;
	}

	/**
	 * Call the query method.
	 *
	 * @param string $method The method.
	 * @param array  $args   The arguments.
	 *
	 * @return mixed
	 */
	public function __call( $method, $args ) {
		return $this->query->$method( ...$args );
	}
}
