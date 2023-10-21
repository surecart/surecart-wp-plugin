<?php

declare(strict_types=1);

namespace SureCart\BlockValidator;

/**
 * VariantChoice Block validator.
 */
class VariantChoice extends BlockValidator {
	/**
	 * The block to search for.
	 *
	 * @var string
	 */
	protected string $searched_block = 'surecart/product-variant-choices';

	/**
	 * Validate block.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block The block.
	 *
	 * @return bool
	 */
	protected function validate( string $block_content, array $block ): bool {
		// Return if not surecart/product-buy-buttons block.
		if ( 'surecart/product-buy-buttons' !== $block['blockName'] ) {
			return false;
		}

		$product = get_query_var( 'surecart_current_product' );

		// If not in product page return.
		if ( empty( $product ) ) {
			return false;
		}

		// If no variant, return.
		if ( ! count( $product->variants->data ?? [] ) ) {
			return false;
		}

		// If has block already exist, return.
		if ( has_block( $this->searched_block, $this->getBlockContent( $product ) ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Render block.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block The block.
	 *
	 * @return string
	 */
	protected function render( string $block_content, array $block ): string {
		$appended_block = ( new \SureCartBlocks\Blocks\Product\VariantChoices\Block() )->render( [], '' );

		return $appended_block . $block_content;
	}
}
