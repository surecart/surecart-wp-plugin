<?php

namespace SureCartBlocks\Blocks\CartCTA;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Cart CTA Block.
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 * @param object $block Block object.
	 *
	 * @return string
	 */
	public function render( $attributes, $content, $block = null ) {
		ob_start(); ?>

		<sc-flex
			slot="<?php echo esc_attr( 'cart-' . ( $attributes['slot'] ?? 'header' ) ); ?>"
			justify-content="space-between"
			align-items="center">
			<sc-text style="--font-size: var(--sc-font-size-x-small); --line-height: var(--sc-line-height-dense); --color: var(--sc-color-gray-700)">
				<?php echo wp_kses_post( $attributes['text'] ?? '' ); ?>
			</sc-text>
			<sc-button href="#" size="small" type="primary">Try It</sc-button>
		</sc-flex>

		<?php
		return ob_get_clean();
	}
}
