<?php

namespace SureCart\Integrations\Contracts;

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
			return $this->getNoIndexRobots();
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
			// Check in $_GET for query parameters.
			if ( isset( $_GET[ $query_var ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				return true;
			}

			// Check in WP_Query.
			if ( get_query_var( $query_var ) ) {
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
		$query_vars = [
			'products-sc_collection',
			'products-search',
			'products-order',
			'products-orderby',
			'line_items',
			'currency',
		];

		// Add all registered taxonomies for sc_product.
		$product_taxonomies = get_object_taxonomies( 'sc_product', 'names' );
		if ( ! empty( $product_taxonomies ) ) {
			foreach ( $product_taxonomies as $taxonomy ) {
				$query_vars[] = 'products-' . $taxonomy;
			}
		}

		/**
		 * Filter the query variables that should trigger noindex in SEO plugins.
		 *
		 * @param array $query_vars Array of query variable names.
		 */
		return apply_filters( 'surecart/noindex_query_vars', $query_vars );
	}

	/**
	 * Get the noindex robots array.
	 *
	 * @return array
	 */
	protected function getNoIndexRobots(): array {
		return [
			'noindex'  => 'noindex',
			'nofollow' => 'nofollow',
		];
	}
}
