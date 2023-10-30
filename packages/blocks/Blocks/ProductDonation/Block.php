<?php

namespace SureCartBlocks\Blocks\ProductDonation;

use SureCart\Models\Product;
use SureCartBlocks\Blocks\BaseBlock;
use SureCartBlocks\Util\BlockStyleAttributes;

/**
 * Product Title Block
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
		if ( empty( $attributes['product_id'] ) ) {
			return '';
		}

		$product = Product::with( [ 'prices' ] )->find( $attributes['product_id'] ?? '' );
		if ( is_wp_error( $product ) ) {
			return $product->get_error_message();
		}

		// get amounts from inner blocks.
		$amounts = array_filter(
			array_map(
				function( $block ) {
					return $block['attrs']['amount'] ?? '';
				},
				$this->block->parsed_block['innerBlocks']
			)
		);

		// set initial state.
		sc_initial_state(
			[
				'checkout' => [
					'initialLineItems' => $this->getInitialLineItems($product, $amounts),
				],
				'productDonation' => [
					$attributes['product_id'] => [
						'product'       => $product->toArray(),
						'amounts'       => $amounts,
						'ad_hoc_amount' => $amounts[0] ?? '' ?? '',
						'selectedPrice' => $product->prices->data[0]->toArray(),
					],
				],
			]
		);

		[ 'styles' => $styles] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes, [ 'margin' ] );

		ob_start(); ?>

		<sc-product-donation-choices
			product-id="<?php echo esc_attr( $attributes['product_id'] ); ?>"
			amount-label="<?php echo esc_attr( $attributes['amount_label'] ?? '' ); ?>"
			recurring-label="<?php echo esc_attr( $attributes['recurring_label'] ?? '' ); ?>"
			recurring-choice-label="<?php echo esc_attr( $attributes['recurring_choice_label'] ?? '' ); ?>"
			non-recurring-choice-label="<?php echo esc_attr( $attributes['non_recurring_choice_label'] ); ?>"
			amount-columns="<?php echo esc_attr( $attributes['amount_columns'] ); ?>"
			style="<?php echo esc_attr( $this->getVars( $attributes, '--sc-choice' ) ); ?> border: none; <?php echo esc_attr( $styles ); ?>"
		>
			<?php echo filter_block_content( $content ); ?>
		</sc-product-donation-choices>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the initial line items.
	 *
	 * @return array
	 */
	public function getInitialLineItems( $product, $amounts ) {
		if ( empty($product->prices->data[0]) || empty($amounts) ) {
			return [];
		}

		// Get first value from amounts that is in range of price ad_hoc_min_amount & ad_hoc_max_amount.
		$ad_hoc_amount = $amounts[0] ?? '';

		foreach ( $amounts as $amount ) {
			if ( $amount >= $product->prices->data[0]->ad_hoc_min_amount && $amount <= $product->prices->data[0]->ad_hoc_max_amount ) {
				$ad_hoc_amount = $amount;
				break;
			}
		}

		$line_items = array (
			[
				'price' => $product->prices->data[0]->id,
				'ad_hoc_amount' => $ad_hoc_amount,
				'quantity'   => 1,
			],
		);

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
		$initial = sc_initial_state();
		return ! empty( $initial['checkout']['initialLineItems'] ) ? $initial['checkout']['initialLineItems'] : [];
	}
}
