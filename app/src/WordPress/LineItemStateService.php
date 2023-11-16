<?php

namespace SureCart\WordPress;

/**
 * LineItemStateService class
 */
class LineItemStateService {
	/**
	 * Keeps track of already parsed blocks.
	 *
	 * @var array
	 */
	protected static $parsed_blocks = [];

	/**
	 * Get existing line items from the checkout.
	 *
	 * @param string $store The store name.
	 * @param string $key The key to get.
	 */
	public function get( $store = 'checkout', $key = 'initialLineItems' ) {
		$initial = sc_initial_state();
		return ! empty( $initial[ $store ][ $key ] ) ? $initial[ $store ][ $key ] : [];
	}

	/**
	 * Add line items to the checkout.
	 *
	 * @param array $line_items The line items to add.
	 *
	 * @return array The new line items.
	 */
	public function merge( $line_items = [] ) {
		$encoded = wp_json_encode( \WP_Block_Supports::$block_to_render );
		if ( in_array( $encoded, self::$parsed_blocks ) ) {
			return $this->get();
		}
		self::$parsed_blocks[] = $encoded;
		$existing              = $this->get();
		return array_merge( $existing, $line_items );
	}
}
