<?php

namespace SureCartBlocks\Blocks\Product\BuyButton;

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
		ob_start();
		?>

		<sc-product-buy-button add-to-cart href="#" type="primary">
			<?php echo esc_html( $attributes['text'] ); ?>
		</sc-product-buy-button>

		<?php
		return ob_get_clean();
	}
}
