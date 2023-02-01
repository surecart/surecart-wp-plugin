<?php

namespace SureCartBlocks\Blocks\Product\Info;

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
		global $sc_product;
		// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
		\SureCart::assets()->addComponentData(
			'sc-product',
			'#product-' . $sc_product->id,
			[
				'product' => $sc_product,
			]
		);
		ob_start(); ?>

		<sc-product
			id="product-<?php echo esc_attr( $sc_product->id ); ?>"
			class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>"
		>
				<?php echo filter_block_content( $content, 'post' ); ?>
		</sc-product>

		<?php
		return ob_get_clean();
	}
}
