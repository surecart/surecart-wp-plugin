<?php

namespace SureCart\Models\Blocks;

/**
 * Abstract product list block.
 */
abstract class AbstractProductListBlock {
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
	 * Get a query attribute with fallback to context and default.
	 *
	 * @param string $key The attribute key to fetch.
	 * @param mixed  $default_value The default value if not found.
	 *
	 * @return mixed
	 */
	protected function getQueryAttribute( $key, $default_value = null ) {
		return $this->block->parsed_block['attrs']['query'][ $key ] ?? $this->block->context['query'][ $key ] ?? $default_value;
	}

	/**
	 * Get the query attribute.
	 *
	 * @param string $key The key.
	 * @return \WP_Query
	 */
	public function __get( $key ) {
		if ( 'has_pagination' === $key ) {
			$max_page = $this->getQueryAttribute( 'pages', 0 );

			// if the max page is 1, we don't have a next page.
			if ( 1 === $max_page ) {
				return false;
			}

			return $this->max_num_pages > 1;
		}

		// handle pagination.
		if ( 'next_page_link' === $key ) {
			$max_page = $this->getQueryAttribute( 'pages', 0 );

			// if the max page is 1, we don't have a next page.
			if ( 1 === $max_page ) {
				return '';
			}

			// if the max page is greater than or equal to the query max num pages, we don't have a next page.
			if ( $max_page && $max_page === $this->paged ) {
				return '';
			}

			return $this->max_num_pages && $this->max_num_pages !== $this->paged ? $this->url->addPageArg( $this->paged + 1 )->url() : '';
		}

		if ( 'previous_page_link' === $key ) {
			$max_page = $this->getQueryAttribute( 'pages', 0 );

			// if the max page is 1, we don't have a next page.
			if ( 1 === $max_page ) {
				return '';
			}

			return $this->paged > 1 ? $this->url->addPageArg( $this->paged - 1 )->url() : '';
		}

		if ( 'pagination_links' === $key ) {
			$max_page = $this->getQueryAttribute( 'pages', 0 );

			// if the max page is 1, we don't have a next page.
			if ( 1 === $max_page ) {
				return [];
			}

			return array_map(
				function ( $i ) {
					return array(
						'href'    => $this->url->addPageArg( $i )->url(),
						'name'    => $i,
						'current' => (int) $i === (int) $this->paged,
					);
				},
				range( 1, $max_page ? min( $this->max_num_pages, $max_page ) : $this->max_num_pages )
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
