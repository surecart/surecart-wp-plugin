<?php

namespace SureCart\Models\Blocks;

/**
 * The product review block.
 */
class ProductReviewBlock {
	/**
	 * The URL.
	 *
	 * @var object
	 */
	protected $url;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url = \SureCart::block()->urlParams();
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
	 * Get the context.
	 *
	 * @param array $context The context to add to the existing context.
	 *
	 * @return array
	 */
	public function context( $context = [] ) {
		$product = sc_get_product();
		if ( empty( $product ) ) {
			return [];
		}

		return wp_parse_args(
			$context,
			array(
				'busy' => false,
			),
		);
	}

	/**
	 * Get the state.
	 *
	 * @param array $state The state to add to the existing state.
	 *
	 * @return array
	 */
	public function state( $state = [] ) {
		$product = sc_get_product();
		if ( empty( $product ) ) {
			return [];
		}

		return wp_parse_args(
			$state,
			[
				'busy' => false,
			]
		);
	}
}
