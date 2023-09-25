<?php

namespace SureCartBlocks\Blocks\Product\Description;

use SureCartBlocks\Blocks\ProductBlock;

/**
 * Product Title Block
 */
class Block extends ProductBlock {
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
		$product = $this->getProduct( $attributes );
		if ( empty( $product->description ) ) {
			return '';
		}
		ob_start(); ?>

		<div class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php echo wp_kses_post( $product->description ?? '' ); ?>
		</div>

		<?php
		return ob_get_clean();
	}
}
