<?php

namespace SureCartBlocks\Blocks\ProductPrices;

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
		global $sc_product;
		ob_start(); ?>

		<sc-product-prices
			class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
			<?php if ( ! empty( $sc_product->prices->data[0] ) ) : ?>
				<?php echo esc_html( Currency::format( $sc_product->prices->data[0]->amount, $sc_product->prices->data[0]->currency ) ); ?>
			<?php endif; ?>
		</sc-product-prices>

		<?php
		return ob_get_clean();
	}
}
