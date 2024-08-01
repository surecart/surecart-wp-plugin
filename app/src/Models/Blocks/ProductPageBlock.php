<?php

namespace SureCart\Models\Blocks;

/**
 * The product list service.
 */
class ProductPageBlock {
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
	 * Constructor.
	 *
	 * @param \WP_Block $block The block.
	 */
	public function __construct( $block ) {
		$this->block = $block;
		$this->url   = \SureCart::block()->urlParams( 'product' );
	}

	/**
	 * Get the variants query.
	 *
	 * @return array|null
	 */
	public function getVariantsQuery() {
		$product = sc_get_product();

		if ( empty( $product ) || empty( $product->variants->data ) ) {
			return null;
		}

		// get the initial defaults if there were no args.
		$initial_defaults = array_reduce(
			$product->variant_options->data ?? [],
			function ( $carry, $option ) {
				$carry[ $option->name ] = strtolower( $option->values[0] );
				return $carry;
			},
			[]
		);

		// use initial defaults to only get args needed.
		$args = [];
		foreach ( $initial_defaults as $key => $value ) {
			$args[ $key ] = $this->url->getArg( $key );
		}

		// merge the args with the initial defaults.
		$attributes = wp_parse_args(
			array_filter( $args ),
			$initial_defaults
		);

		// loop through the attributes.
		$keys = [];
		foreach ( $attributes as $option_name => $value ) {
			// find the option index based on the name.
			$option_index                              = array_search( $option_name, array_column( $product->variant_options->data, 'name' ) );
			$keys[ 'option_' . ( $option_index + 1 ) ] = $value;
		}

		return $keys;
	}

	/**
	 * Get the URL.
	 *
	 * @return object|null
	 */
	public function getSelectedVariant() {
		$product = sc_get_product();

		if ( empty( $product ) || empty( $product->variants->data ) ) {
			return null;
		}

		// loop through the attributes.
		$keys = $this->getVariantsQuery();

		$variants = array_values(
			array_filter(
				( $product->variants->data ?? [] ),
				function ( $variant ) use ( $keys ) {
					foreach ( $keys as $key => $value ) {
						if ( strtolower( $variant->$key ) !== strtolower( $value ) ) {
							return false;
						}
					}
					return true;
				}
			)
		);

		return $variants[0] ?? $product->first_variant_with_stock;
	}

	/**
	 * Get the URL.
	 *
	 * @return object|null
	 */
	public function urlParams() {
		return $this->url;
	}
}
