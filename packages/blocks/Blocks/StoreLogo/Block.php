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
		$logo = \SureCart::account()->brand->logo_url;

		if ( empty( $logo ) ) {
			return;
		}

		$styles = 'object-fit: contain; object-position: left;';
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

		<div>

		<?php if ( $attributes['isLinkToHome'] ) { ?>
			<a href="<?php echo esc_url( get_home_url() ); ?>" rel="home">
		<?php } ?>

			<img
				src="<?php echo esc_url( $logo ); ?>"
				style="<?php echo esc_attr( $styles ); ?>"
				alt=""
			/>

		<?php if ( $attributes['isLinkToHome'] ) { ?>
			</a>
		<?php } ?>

		</div>

		<?php
		return ob_get_clean();
	}
}
