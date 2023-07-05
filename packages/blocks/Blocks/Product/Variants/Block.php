<?php

namespace SureCartBlocks\Blocks\Product\Variants;

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
		
		ob_start();
		
		?>
		<sc-product-variation-choices/>
		</sc-product-variation-choices>
		<?php
		return ob_get_clean();
		
		// $product = get_query_var( 'surecart_current_product' );

		// $variations = $product['variant_options']->data;
		
		// $options = array();

		// foreach ( $variations as $variation ) {
		// 	if ( ! $variation->name ) {
		// 		continue;
		// 	}
		// 	$variation_values = $variation->variant_values->data;
		// 	$options[ $variation->id ] = array(
		// 		'name' => $variation->name,
		// 		'position' => $variation->position,
		// 		'values' => array()
		// 	);
		// 	foreach ( $variation_values as $value ) {
		// 		$options[ $variation->id ]['values'][ $value->id ] = array(
		// 			'name' => $value->label,
		// 			'position' => $value->position,
		// 		);
		// 	}
		// }
	}
}
