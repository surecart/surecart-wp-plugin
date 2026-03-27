<?php

namespace SureCart\Models\Blocks;

/**
 * The product list block.
 */
class ProductListBlock extends AbstractProductListBlock {
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

		// build up the query.
		$query_vars = array_filter(
			array(
				'post_type'           => 'sc_product',
				'post_status'         => 'publish',
				'ignore_sticky_posts' => 1,
				'posts_per_page'      => $per_page,
				'offset'              => ( $per_page * ( $page - 1 ) ) + $offset,
				'paged'               => (int) $this->url->getCurrentPage(),
				'order'               => $order,
				'orderby'             => $orderby,
				's'                   => sanitize_text_field( $this->url->getArg( 'search' ) ),
			)
		);

		// handle search.
		if ( ! empty( $query['search'] ) && empty( $query_vars['s'] ) ) {
			$query_vars['s'] = sanitize_text_field( $query['search'] );
		}

		// put together price query.
		if ( 'price' === $this->url->getArg( 'orderby' ) ) {
			$query_vars['meta_key'] = 'min_price_amount';
			$query_vars['orderby']  = 'meta_value_num';
		}

		$tax_query = array(
			'relation' => 'OR',
		);

		// handle tax query.
		if ( ! empty( $query['taxQuery'] ) ) {
			foreach ( $query['taxQuery'] as $taxonomy => $terms ) {
				if ( is_taxonomy_viewable( $taxonomy ) && ! empty( $terms ) ) {
					$tax_query[] = array(
						'taxonomy'         => sanitize_key( $taxonomy ),
						'terms'            => array_filter( array_map( 'absint', $terms ) ),
						'include_children' => false,
					);
				}
			}
		}

		// put together price query.
		if ( 'price' === $orderby ) {
			$query_vars['meta_key'] = 'min_price_amount';
			$query_vars['orderby']  = 'meta_value_num';
		}

		$collection_id = sanitize_text_field( $this->block->context['surecart/product-list/collection_id'] ?? $this->block->parsed_block['attrs']['collection_id'] ?? '' );

		// handle collection id send from "sc_product_collection" shortcode.
		if ( ! empty( $collection_id ) ) {
			$collection_ids = array_unique( array_map( 'sanitize_text_field', explode( ',', $collection_id ) ) );

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

			// only get the term_id.
			$legacy_collection_ids = array_map(
				function ( $term ) {
					return $term->term_id;
				},
				$legacy_collection_ids
			);

			$tax_query[] =
				array(
					'taxonomy' => 'sc_collection',
					'field'    => 'term_id',
					'terms'    => array_unique( array_map( 'absint', $legacy_collection_ids ?? array() ) ),
				);
		} elseif ( is_tax() ) {
				$term        = get_queried_object();
				$tax_query[] =
				array(
					'taxonomy' => 'sc_collection',
					'field'    => 'term_id',
					'terms'    => array_unique( array_map( 'absint', [ (int) $term->term_id ] ) ),
				);
		}

		$all_taxonomies = $this->url->getAllTaxonomyArgs();

		// handle taxonomies query.
		foreach ( $all_taxonomies as $taxonomy => $terms ) {
			$tax_query[] =
				array(
					'taxonomy' => $taxonomy,
					'field'    => 'slug',
					'terms'    => array_unique( array_map( 'strval', $terms ?? array() ) ),
					'operator' => 'IN',
				);
		}

		$query_vars['tax_query'][] = $tax_query;

		// handle featured.
		if ( 'featured' === ( $this->block->context['surecart/product-list/type'] ?? 'all' ) ) {
			$query_vars['meta_query'] = [
				[
					'key'     => 'featured',
					'value'   => '1',
					'compare' => '=',
				],
			];
		}

		if ( 'custom' === ( $this->block->context['surecart/product-list/type'] ?? $this->block->parsed_block['attrs']['type'] ?? 'all' ) ) {
			$query = $this->getQueryContext();
			// backward compatibility.

			$ids = ! empty( $query['include'] ) ? $query['include'] : ( ! empty( $this->block->context['surecart/product-list/ids'] ) ? $this->block->context['surecart/product-list/ids'] : ( ! empty( $this->block->parsed_block['attrs']['ids'] ) ? $this->block->parsed_block['attrs']['ids'] : [] ) );
			$ids = is_array( $ids ) ? $ids : explode( ',', $ids );

			// fallback for older strings - get the ids of legacy products.
			$legacy_ids           = [];
			$ids_that_are_strings = array_map( 'sanitize_text_field', array_filter( $ids, 'is_string' ) );
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
			$ids_that_are_integers = array_filter( $ids, 'is_int' );

			// post in.
			$query_vars['post__in'] = array_merge( $legacy_ids, $ids_that_are_integers );

			// order by posts if there is not an order by.
			if ( empty( $query_vars['orderby'] ) ) {
				$query_vars['orderby'] = 'post__in';
			}
		}

		return $query_vars;
	}

	/**
	 * Get the terms.
	 *
	 * @return array
	 */
	public function getTermOptions( $taxonomy_slug = 'sc_collection' ) {
		$taxonomy_slug = ! empty( $taxonomy_slug ) ? $taxonomy_slug : 'sc_collection';

		// get non-empty terms.
		$terms = get_terms(
			array(
				'taxonomy'   => $taxonomy_slug,
				'hide_empty' => true,
			)
		);

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		// we are on a collection page.
		$current_term = get_queried_object();
		if ( is_a( $current_term, \WP_Term::class ) ) {
			return false;
		}

		$url = \SureCart::block()->urlParams( 'products' );

		$options = array_map(
			function ( $term ) use ( $url, $taxonomy_slug ) {
				return [
					'value'   => $term->slug,
					'label'   => $term->name,
					'href'    => $url->hasFilterArg( $taxonomy_slug, $term->slug ) ? $url->removeFilterArg( $taxonomy_slug, $term->slug ) : $url->addFilterArg( $taxonomy_slug, $term->slug ),
					'checked' => $url->hasFilterArg( $taxonomy_slug, $term->slug ),
				];
			},
			$terms ?? []
		);

		// no filter options.
		if ( empty( $options ) ) {
			return false;
		}

		return $options;
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
		$query_vars = $this->parse_query();
		wp_reset_postdata();

		add_filter( 'found_posts', [ $this, 'offsetFoundPosts' ], 1 );
		$this->query = new \WP_Query( $query_vars );
		remove_filter( 'found_posts', [ $this, 'offsetFoundPosts' ], 1 );

		return $this;
	}
}
