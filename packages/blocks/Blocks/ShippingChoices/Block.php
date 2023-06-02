<?php

namespace SureCartBlocks\Blocks\StoreLogo;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Shipping Choices Block.
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
		ob_start(); ?>
		<sc-shipping-choices
			class="<?php echo esc_attr( $attributes['className'] ?? '' ); ?>"
			show-control="<?php echo esc_attr( $attributes['showControl'] ?? '' ); ?>"
			label= "<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
		>
		</sc-shipping-choices>
		<?php
		return ob_get_clean();
	}
}
