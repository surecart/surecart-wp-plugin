<?php

namespace SureCartBlocks\Blocks\PriceSelector;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		sc_initial_state(
			[
				'checkout' => [
					'initialLineItems' => $this->getInitialLineItems(),
				],
			]
		);
		return '<sc-price-choices label="' . esc_attr( $attributes['label'] ?? '' ) . '" type="' . esc_attr( $attributes['type'] ?? 'radio' ) . '" columns="' . intval( $attributes['columns'] ?? 1 ) . '">' . filter_block_content( $content, 'post' ) . '</sc-price-choices>';
	}

	/**
	 * Get the initial line items.
	 *
	 * @return array
	 */
	public function getInitialLineItems() {
		// get choice blocks.
		$choices = $this->getInnerPriceChoices();

		// are any checked by default?
		$checked = array_filter(
			$choices,
			function( $block ) {
				return ! empty( $block['attrs']['checked'] );
			}
		);

		// there are no checked, so use the first one.
		if ( empty( $checked ) ) {
			$checked = [ $choices[0] ] ?? [];
		}

		// get the line items.
		$line_items = $this->convertPriceBlocksToLineItems( $checked );
		$existing   = $this->getExistingLineItems();

		// merge any existing with the new ones.
		return array_merge( $existing, $line_items );
	}

	/**
	 * Get any existing line items.
	 *
	 * @return array
	 */
	public function getExistingLineItems() {
		$initial = \SureCart::state()->getData();
		return ! empty( $initial['checkout']['initialLineItems'] ) ? $initial['checkout']['initialLineItems'] : [];
	}

	/**
	 * Get the inner price choice blocks.
	 *
	 * @return array
	 */
	public function getInnerPriceChoices() {
		return array_filter(
			$this->block->parsed_block['innerBlocks'],
			function( $block ) {
				return 'surecart/price-choice' === $block['blockName'] && ! empty( $block['attrs']['price_id'] );
			}
		);
	}

	/**
	 * Convert price blocks to line items
	 *
	 * @param array $blocks Array of parsed blocks.
	 *
	 * @return array    Array of line items.
	 */
	public function convertPriceBlocksToLineItems( $blocks ) {
		return array_values(
			array_map(
				function( $block ) {
					return [
						'price'    => $block['attrs']['price_id'],
						'quantity' => $block['attrs']['quantity'] ?? 1,
					];
				},
				$blocks
			)
		);
	}
}
