<?php

namespace SureCartBlocks\Blocks\Coupon;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
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
		<sc-order-coupon-form label="<?php echo esc_attr( $attributes['text'] ?? '' ); ?>" <?php echo ! empty( $attributes['collapsed'] ) ? 'collapsed' : ''; ?> placeholder="<?php echo esc_attr( $attributes['placeholder'] ); ?>">
			<?php echo wp_kses_post( $attributes['button_text'] ?? __( 'Apply', 'surecart' ) ); ?>
		</sc-order-coupon-form>
		<?php
		return ob_get_clean();
	}
}
