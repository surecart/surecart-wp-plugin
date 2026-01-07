<?php

namespace SureCart\Integrations\Abstracts;

/**
 * Abstract base class for SEO plugin integrations that handle noindex robots meta.
 */
abstract class NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = '';

	/**
	 * The query vars that should trigger noindex.
	 *
	 * @var array
	 */
	protected $query_vars = [
		'products-search',
		'products-order',
		'products-orderby',
		'line_items',
		'currency',
	];

	/**
	 * The noindex robots.
	 *
	 * @var array
	 */
	protected $noindex_robots = [
		'noindex'  => 'noindex',
		'nofollow' => 'nofollow',
	];

	/**
	 * Bootstrap the service.
	 *
	 * @throws \RuntimeException If hook_name is not set.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		if ( empty( $this->hook_name ) ) {
			throw new \RuntimeException( 'Missing hook_name for noindex service: ' . static::class );
		}

		add_filter( $this->hook_name, [ $this, 'addNoindexForQueryVars' ] );
	}

	/**
	 * Modify robots to add noindex for SureCart query vars.
	 *
	 * @param array $robots Robots array.
	 *
	 * @return array Modified robots.
	 */
	public function addNoindexForQueryVars( array $robots ): array {
		if ( $this->hasNoIndexQueryVars() ) {
			return $this->noindex_robots;
		}

		return $robots;
	}

	/**
	 * Check if the current request has any SureCart query variables.
	 *
	 * @return bool True if any SureCart query var is present.
	 */
	protected function hasNoIndexQueryVars(): bool {
		$query_vars = $this->getNoIndexQueryVars();

		foreach ( $query_vars as $query_var ) {
			// Safe to use $_GET directly as we only check existence, not values.
			if ( isset( $_GET[ $query_var ] ) || get_query_var( $query_var ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				return true;
			}
		}

		return false;
	}

	/**
	 * Get SureCart query variables that should trigger noindex.
	 *
	 * @return array List of query variable names.
	 */
	protected function getNoIndexQueryVars(): array {
		$query_vars = $this->query_vars;

		// Add all registered taxonomies for sc_product.
		$product_taxonomies = get_object_taxonomies( 'sc_product', 'names' );
		if ( ! empty( $product_taxonomies ) ) {
			foreach ( $product_taxonomies as $taxonomy ) {
				$query_vars[] = 'products-' . $taxonomy;
			}
		}

		return apply_filters( 'surecart/noindex_query_vars', array_unique( $query_vars ), $this );
	}
}
