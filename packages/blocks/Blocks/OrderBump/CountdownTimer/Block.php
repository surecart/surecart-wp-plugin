<?php

namespace SureCartBlocks\Blocks\OrderBump\CountdownTimer;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Order Bump Count Down Timer Block
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
		$product = get_query_var( 'surecart_current_bump' );
		if ( empty( $product->description ) ) {
			return '';
		}
		ob_start(); ?>

		<div class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
			<!--  -->
		</div>

		<?php
		return ob_get_clean();
	}
}
