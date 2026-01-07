<?php

namespace SureCart\Models\Blocks;

use SureCart\Models\Review;

/**
 * The product review list block.
 */
class ProductReviewListBlock extends AbstractProductListBlock {
	/**
	 * Product ID.
	 *
	 * @var string
	 */
	public $product_id;

	/**
	 * The collection result.
	 *
	 * @var \SureCart\Models\Collection
	 */
	protected $collection;

	/**
	 * Constructor.
	 *
	 * @param \WP_Block $block The block.
	 * @param string    $product_id The product ID.
	 */
	public function __construct( \WP_Block $block, $product_id = null ) {
		$this->block      = $block;
		$this->url        = \SureCart::block()->urlParams( 'reviews' );
		$this->product_id = $product_id ?? ( $block->context['postId'] ?? null );
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
	 * Build the query
	 *
	 * @return $this
	 */
	public function parse_query() {
		$query = $this->getQueryContext();

		// pagination.
		$offset   = absint( $query['offset'] ?? 0 );
		$per_page = $this->block->parsed_block['attrs']['query']['perPage']
			?? $this->block->parsed_block['attrs']['limit']
			?? $query['perPage']
			?? 15;

		// order.
		$url_order = $this->url->getArg( 'order' );
		$order     = ! empty( $url_order ) ? sanitize_text_field( $url_order ) : ( $query['order'] ?? 'desc' );

		// orderby.
		$url_orderby = $this->url->getArg( 'orderby' );
		$orderby     = ! empty( $url_orderby ) ? sanitize_text_field( $url_orderby ) : ( $query['orderBy'] ?? 'date' );

		// page.
		$page = $this->url->getCurrentPage();

		$args = array(
			'status[]'      => 'published',
			'product_ids[]' => [ $this->product_id ],
		);

		// Filter by star ratings if provided.
		$stars_filter = $this->url->getArg( 'ratings' );
		if ( ! empty( $stars_filter ) ) {
			$stars = is_array( $stars_filter ) ? $stars_filter : [ $stars_filter ];

			foreach ( $stars as $star ) {
				if ( (int) $star >= 1 && (int) $star <= 5 ) {
					$args['stars'][] = (int) $star;
				}
			}
		}

		if ( $orderby && in_array( $orderby, [ 'stars', 'created_at', 'updated_at' ], true ) ) {
			$args['sort'] = $orderby . ':' . $order;
		}

		// Pagination.
		$args['limit']  = $per_page;
		$args['offset'] = ( $page - 1 ) * $per_page + $offset;

		$this->collection = Review::where( $args )
			->with( [ 'customer' ] )
			->paginate(
				[
					'page'     => $page,
					'per_page' => $per_page,
				]
			);

		return $this;
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

	/**
	 * Magic getter for pagination properties.
	 *
	 * @param string $key The property key.
	 * @return mixed
	 */
	public function __get( $key ) {
		// Handle collection data access.
		if ( 'data' === $key && $this->collection ) {
			return $this->collection->data ?? [];
		}

		// Handle max_num_pages for pagination.
		if ( 'max_num_pages' === $key && $this->collection ) {
			$pagination = $this->collection->pagination ?? new \stdClass();
			$count      = $pagination->count ?? 0;
			$limit      = $pagination->limit ?? 1;
			$pages      = $limit > 0 ? (int) ceil( $count / $limit ) : 1;
			return $pages;
		}

		// Handle paged (current page).
		if ( 'paged' === $key && $this->collection ) {
			$pagination = $this->collection->pagination ?? new \stdClass();
			return $pagination->page ?? 1;
		}

		// Handle found_posts.
		if ( 'found_posts' === $key && $this->collection ) {
			$pagination = $this->collection->pagination ?? new \stdClass();
			return $pagination->count ?? 0;
		}

		// Handle has_pagination specifically for collection-based queries.
		if ( 'has_pagination' === $key && $this->collection ) {
			$max_page = $this->getQueryAttribute( 'pages', 0 );

			// if the max page is 1, we don't have a next page.
			if ( 1 === $max_page ) {
				return false;
			}

			$max_num_pages = $this->__get( 'max_num_pages' );
			$result        = $max_num_pages > 1;
			return $result;
		}

		// Delegate to parent for other properties.
		return parent::__get( $key );
	}
}
