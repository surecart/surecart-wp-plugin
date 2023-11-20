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
		$initial = sc_initial_state();

		$merged_line_items = array_map(
			function( $line_item ) use ( $initial ) {
				foreach ( $initial['checkout']['initialLineItems'] as $key => $existing_line_item ) {
					if ( $existing_line_item['price_id'] === $line_item['price_id'] && $existing_line_item['variant_id'] === $line_item['variant_id'] ) {
						return $line_item;
					}
				}
				return $existing_line_item;
			},
			$line_items
		);

		return array_merge( $initial['checkout']['initialLineItems'], $merged_line_items );
	}
}
