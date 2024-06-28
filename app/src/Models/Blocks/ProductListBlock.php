<?php

namespace SureCart\Models\Blocks;

/**
 * The product list block.
 */
class ProductListBlock {
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
	 * The query vars.
	 *
	 * @var array
	 */
	protected $query_vars = [];

	/**
	 * The query.
	 *
	 * @var \WP_Query
	 */
	protected $query;

	/**
	 * Constructor.
	 *
	 * @param \WP_Block $block The block.
	 */
	public function __construct( \WP_Block $block ) {
		$this->block = $block;
		$this->url   = \SureCart::block()->urlParams( 'products' )->setInstanceId( (int) $block->context['surecart/product-list/block_id'] ?? '' );
	}

	/**
	 * Build the query
	 *
	 * @return $this
	 */
	public function parse_query() {
		// build up the query.
		$this->query_vars = array_filter(
			array(
				'post_type'           => 'sc_product',
				'post_status'         => 'publish',
				'ignore_sticky_posts' => 1,
				'posts_per_page'      => $this->block->context['surecart/product-list/limit'] ?? 15,
				'paged'               => $this->url->getCurrentPage(),
				'order'               => $this->url->getArg( 'order' ),
				'orderby'             => $this->url->getArg( 'orderby' ),
				's'                   => $this->url->getArg( 'search' ),
			)
		);

		// put together price query.
		if ( 'price' === $this->url->getArg( 'orderby' ) ) {
			$this->query_vars['meta_key'] = 'max_price_amount';
			$this->query_vars['orderby']  = 'meta_value_num';
		}

		$collection_id = $this->block->context['surecart/product-list/collection_id'] ?? ''; // collection id from block context from "sc_product_collection" shortcode.

		$sc_collection = $this->url->getArg( 'sc_collection' ); // collection id from url.

		$collection_ids_to_filter = array();

		// handle collection id send from "sc_product_collection" shortcode.
		if ( ! empty( $collection_id ) ) {
			$collection_ids     = explode( ',', $collection_id );
			$collection_ids_int = array_map( 'intval', array_filter( $collection_ids, 'is_numeric' ) ); // WP taxonomy ids.

			$legacy_collection_ids = get_terms(
				array(
					'taxonomy'   => 'sc_collection',
					'field'      => 'term_id',
					'meta_query' => array(
						array(
							'key'     => 'sc_id',
							'value'   => $collection_ids,
							'compare' => 'IN',
						),
					),

				)
			); // platform collection ids converted to WP taxonomy ids.

			$new_collection_ids = get_terms(
				array(
					'taxonomy'         => 'sc_collection',
					'field'            => 'term_id',
					'term_taxonomy_id' => $collection_ids_int,
				)
			); // WP taxonomy ids.

			// only get the term_id.
			$legacy_collection_ids = array_map(
				function ( $term ) {
					return $term->term_id;
				},
				$legacy_collection_ids
			);

			// only get the term_id.
			$new_collection_ids = array_map(
				function ( $term ) {
					return $term->term_id;
				},
				$new_collection_ids
			);

			$collection_ids_to_filter = array_merge( $legacy_collection_ids, $new_collection_ids );
		}

		// handle collections query.
		if ( ! empty( $sc_collection ) ) {
			$collection_ids_to_filter = array_merge( $collection_ids_to_filter, $sc_collection );
		}

		if ( ! empty( $collection_ids_to_filter ) ) {
			$this->query_vars['tax_query'] =
				array(
					array(
						'taxonomy' => 'sc_collection',
						'field'    => 'term_id',
						'terms'    => array_map( 'intval', $collection_ids_to_filter ?? array() ),
					),
				);
		}

		// handle featured.
		if ( 'featured' === ( $this->block->context['surecart/product-list/type'] ?? 'all' ) ) {
			$this->query_vars['meta_query'] = [
				[
					'key'     => 'featured',
					'value'   => '1',
					'compare' => '=',
				],
			];
		}

		if ( 'custom' === ( $this->block->context['surecart/product-list/type'] ?? 'all' ) ) {
			// fallback for older strings - get the ids of legacy products.
			$legacy_ids           = [];
			$ids_that_are_strings = array_filter( $this->block->context['surecart/product-list/ids'] ?? [], 'is_string' );
			if ( ! empty( $ids_that_are_strings ) ) {
				$legacy_ids = get_posts(
					[
						'post_type'      => 'sc_product',
						'status'         => 'publish',
						'fields'         => 'ids',
						'posts_per_page' => -1,
						'meta_query'     => [
							[
								'key'     => 'sc_id',
								'value'   => $ids_that_are_strings,
								'compare' => 'IN',
							],
						],
					]
				);
			}

			// get only ids that are integers.
			$ids_that_are_integers = array_filter( $this->block->context['surecart/product-list/ids'] ?? [], 'is_int' );

			// post in.
			$this->query_vars['post__in'] = array_merge( $legacy_ids, $ids_that_are_integers );

			// order by posts if there is not an order by.
			if ( empty( $this->query_vars['orderby'] ) ) {
				$this->query_vars['orderby'] = 'post__in';
			}
		}

		return $this;
	}

	/**
	 * Run the query
	 *
	 * @return $this|\WP_Error
	 */
	public function query() {
		$this->parse_query();
		wp_reset_postdata();
		$this->query = new \WP_Query( $this->query_vars );
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
