<?php

namespace SureCart\Models\Blocks;

use SureCart\Models\Review;

/**
 * The product review list block.
 */
class ProductReviewListBlock extends AbstractProductListBlock {
	/**
	 * Get the query context.
	 *
	 * @return array
	 */
	public function getQueryContext() {
		return $this->block->context['query'] ?? [];
	}

	/**
	 * Build the query
	 *
	 * @return $this
	 */
	public function parse_query() {
		$query = $this->getQueryContext();

		$offset   = absint( $query['offset'] ?? 0 );
		$per_page = $this->block->parsed_block['attrs']['query']['perPage'] ?? $this->block->parsed_block['attrs']['limit'] ?? $query['perPage'] ?? 15;
		$order    = ! empty( $this->url->getArg( 'order' ) )
			? sanitize_text_field( $this->url->getArg( 'order' ) )
			: ( ! empty( $query['order'] ) ? $query['order'] : 'desc' );
		$orderby  = ! empty( $this->url->getArg( 'orderby' ) )
			? sanitize_text_field( $this->url->getArg( 'orderby' ) )
			: ( ! empty( $query['orderBy'] ) ? $query['orderBy'] : 'date' );
		$page     = $this->url->getCurrentPage();

		$args = array(
			'status[]' => 'published',
		);

		if ( $orderby && in_array( $orderby, [ 'stars', 'created_at', 'updated_at' ], true ) ) {
			$args['sort'] = $orderby . ':' . $order;
		}

		// Pagination.
		$args['limit']  = $per_page;
		$args['offset'] = ( $page - 1 ) * $per_page + $offset;

		return Review::where( $args )->with( [ 'product', 'product.price', 'customer' ] )->get();
	}

	/**
	 * Offset the found posts.
	 * See: https://codex.wordpress.org/Making_Custom_Queries_using_Offset_and_Pagination
	 *
	 * @param int $found_posts The found posts.
	 *
	 * @return int The found posts with offset.
	 */
	public function offsetFoundPosts( $found_posts ) {
		$query  = $this->getQueryContext();
		$offset = absint( $query['offset'] ?? 0 );

		return $found_posts - $offset;
	}

	/**
	 * Run the query
	 *
	 * @return $this|\WP_Error
	 */
	public function query() {
		return $this->parse_query();
	}
}
