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
	 * @param array  $line_items The line items to add.
	 * @param string $store The store name.
	 * @param string $key The key to get.
	 *
	 * @return array The new line items.
	 */
	public function merge( $line_items = [], $store = 'checkout', $key = 'initialLineItems' ) {
		$initial = sc_initial_state();

		// filter out any line items that were already added.
		$merged_line_items = array_filter(
			$line_items,
			function ( $line_item ) use ( $initial, $store, $key ) {
				// if the line item does not exist, add it.
				return ! $this->lineItemExists( $line_item, $initial[ $store ][ $key ] );
			}
		);

		return array_merge( $initial[ $store ][ $key ] ?? [], $merged_line_items );
	}

	/**
	 * Does the line item exist?
	 *
	 * @param array $line_item The line item to check.
	 *
	 * @return boolean
	 */
	public function lineItemExists( $line_item, $line_items ) {
		foreach ( $line_items as $existing_line_item ) {
			if ( $existing_line_item['price_id'] === $line_item['price_id'] &&
				( ! isset( $line_item['variant_id'] ) || $existing_line_item['variant_id'] === $line_item['variant_id'] ) ) {
				return true;
			}
		}
		return false;
	}
}
