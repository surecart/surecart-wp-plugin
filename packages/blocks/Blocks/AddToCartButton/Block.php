<?php

namespace SureCartBlocks\Blocks\AddToCartButton;

use SureCart\Models\Component;
use SureCartBlocks\Blocks\BaseBlock;
/**
 * Logout Button Block.
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
		// need a price id.
		if ( empty( $attributes['price_id'] ) ) {
			return '';
		}

		return wp_kses_post(
			Component::tag( 'sc-cart-form' )
			->id(
				'cart-form' . sanitize_html_class( $attributes['price_id'] )
			)
				->with(
					[
						'priceId' => $attributes['price_id'],
						'formId'  => \SureCart::forms()->getDefaultId(),
					]
				)->render()
		);
	}
}
