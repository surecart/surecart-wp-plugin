<?php

namespace SureCartBlocks\Blocks\Product\BuyButtons;

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
		ob_start(); ?>

		<sc-spacing style="--spacing: var(--sc-spacing-small)">
			<sc-button full class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
				style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php echo wp_kses_post( $attributes['text'] ); ?>
			</sc-button>

			<sc-button full type="primary" class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
				style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php esc_html_e( 'Buy Now', 'surecart' ); ?>
			</sc-button>
		</sc-spacing>

		<?php
		return ob_get_clean();
	}
}
