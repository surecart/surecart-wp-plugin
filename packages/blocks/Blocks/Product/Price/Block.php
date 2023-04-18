<?php

namespace SureCartBlocks\Blocks\Product\Price;

use SureCart\Support\Currency;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Title Block
 */
class Block extends BaseBlock {
	/**
	 * Keep track of the instance number of this block.
	 *
	 * @var integer
	 */
	public static $instance;

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) ) {
			return '';
		}
		ob_start(); ?>

		<sc-product-price
			class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
			<?php if ( ! empty( $product->prices->data[0] ) ) : ?>
				<?php echo esc_html( Currency::format( $product->prices->data[0]->amount, $product->prices->data[0]->currency ) ); ?>
			<?php endif; ?>
		</sc-product-price>

		<?php
		return ob_get_clean();
	}
}
