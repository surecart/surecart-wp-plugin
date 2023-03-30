<?php

namespace SureCartBlocks\Blocks\Product\Description;

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

		<div class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
			<sc-prose>
				<sc-product-text text="description">
					<?php echo wp_kses_post( $sc_product->description ); ?>
				</sc-product-text>
			</sc-prose>
		</div>

		<?php
		return ob_get_clean();
	}
}
