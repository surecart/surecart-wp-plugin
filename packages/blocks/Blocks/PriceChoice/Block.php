<?php

namespace SureCartBlocks\Blocks\PriceChoice;

use SureCart\Models\Price;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Keep track of number of instances.
	 *
	 * @var integer
	 */
	public static $instance = 0;

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$price = Price::find( $attributes['price_id'] );

		self::$instance++;

		\SureCart::assets()->addComponentData(
			'sc-price-choice',
			'#sc-price-choice-' . (int) self::$instance,
			[
				'price' => $price,
			]
		);

		ob_start(); ?>
		<sc-price-choice
			id="sc-price-choice-<?php echo (int) self::$instance; ?>"
			price-id="<?php echo esc_attr( $attributes['price_id'] ?? '' ); ?>"
			type="<?php echo esc_attr( $attributes['type'] ?? 'radio' ); ?>"
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			description="<?php echo esc_attr( $attributes['description'] ?? '' ); ?>"
			checked="<?php echo esc_attr( $attributes['checked'] ?? 'false' ); ?>"
			show-label="<?php echo esc_attr( $attributes['show_label'] ?? 'false' ); ?>"
			show-price="<?php echo esc_attr( $attributes['show_price'] ?? 'false' ); ?>"
			show-control="<?php echo esc_attr( $attributes['show_control'] ?? 'false' ); ?>"
			quantity="<?php echo esc_attr( $attributes['quantity'] ?? '1' ); ?>"
		></sc-price-choice>
		<?php
		return ob_get_clean();
	}
}
