<?php

namespace SureCartBlocks\Blocks\Product\BuyButtons;

use SureCart\Models\Form;
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

		<sc-flex flex-direction="column">
			<sc-product-buy-button style="flex: 1" add-to-cart full class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>" style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php echo wp_kses_post( $attributes['text'] ); ?>
			</sc-product-buy-button>

			<sc-product-buy-button style="flex: 1"  full type="primary" class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>" style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php esc_html_e( 'Buy Now', 'surecart' ); ?>
			</sc-product-buy-button>
		</sc-flex>

		<?php
		return ob_get_clean();
	}
}
