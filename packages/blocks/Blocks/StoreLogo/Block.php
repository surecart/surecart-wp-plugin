<?php

namespace SureCartBlocks\Blocks\StoreLogo;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Logout Button Block.
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
		$styles = "";
		if ( ! empty( $attributes['width'] ) ) {
			$styles .= 'width: ' . $attributes['width'] . 'px; ';
		}
		if ( ! empty( $attributes['maxWidth'] ) ) {
			$styles .= 'max-width: ' . $attributes['maxWidth'] . 'px; ';
		}
		if ( ! empty( $attributes['maxHeight'] ) ) {
			$styles .= 'max-height: ' . $attributes['maxHeight'] . 'px; ';
		}

		ob_start(); ?>

		<?php if ( $attributes['isLinkToHome'] ) { ?>
			<a href="/" rel="home">
		<?php } ?>

			<img
				src="http://trobogames.local/wp-content/uploads/2023/01/cropped-surecart-logo-4-1.png"
				alt=""
				style="<?php echo esc_attr( $styles ); ?>"
			/>
		
		<?php if ( $attributes['isLinkToHome'] ) { ?>
			</a>
		<?php } ?>

		<?php
		return ob_get_clean();
	}
}
