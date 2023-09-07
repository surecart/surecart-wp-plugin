<?php

namespace SureCartBlocks\Blocks\Product\Price;

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
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) ) {
			return '';
		}

		$active_prices = array_values(
			array_filter(
				$product->prices->data ?? [],
				function( $price ) {
					return ! $price->archived;
				}
			)
		);

		ob_start(); ?>

		<sc-product-price
			sale-text="<?php echo esc_attr( $attributes['sale_text'] ?? '' ); ?>"
			class="<?php echo esc_attr( $this->getClasses( $attributes ) . ' product-price surecart-block' ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>;--sc-product-price-alignment:<?php echo esc_attr( $attributes['alignment'] ?? 'left' ); ?>"
			>

			<?php if ( ! empty( $active_prices[0] ) ) : ?>
				<?php echo esc_html( Currency::format( $active_prices[0]->amount, $active_prices[0]->currency ) ); ?>
			<?php endif; ?>
		</sc-product-price>

		<?php
		return ob_get_clean();
	}
}
