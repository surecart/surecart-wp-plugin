<?php

namespace SureCartBlocks\Blocks\Submit;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Submit Button Block.
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
	public function render( $attributes, $content = '' ) {
		$text_color       = '';
		$background_color = '';

		// Check for preset colors first, then custom colors.
		if ( ! empty( $attributes['textColor'] ) ) {
			$text_color = $this->getColorPresetCssVar( $attributes['textColor'] );
		} elseif ( ! empty( $attributes['style']['color']['text'] ) ) {
			$text_color = $attributes['style']['color']['text'];
		}

		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$background_color = $this->getColorPresetCssVar( $attributes['backgroundColor'] );
		} elseif ( ! empty( $attributes['style']['color']['background'] ) ) {
			$background_color = $attributes['style']['color']['background'];
		}

		ob_start();
		?>
		<sc-order-submit
			type="<?php echo esc_attr( $attributes['type'] ?? 'primary' ); ?>"
			full="<?php echo ! empty( $attributes['full'] ) ? 'true' : 'false'; ?>"
			size="<?php echo esc_attr( $attributes['size'] ?? 'large' ); ?>"
			<?php echo ! empty( $attributes['show_icon'] ) ? 'icon="lock"' : ''; ?>
			show-total="<?php echo ! empty( $attributes['show_total'] ) ? 'true' : 'false'; ?>"
			secure-notice="<?php echo ! empty( $attributes['show_secure_notice'] ) ? 'true' : 'false'; ?>"
			secure-notice-text="<?php echo esc_attr( $attributes['secure_notice_text'] ?? '' ); ?>"
			<?php echo $text_color ? 'text-color="' . esc_attr( $text_color ) . '"' : ''; ?>
			<?php echo $background_color ? 'background-color="' . esc_attr( $background_color ) . '"' : ''; ?>
			class="wp-block-surecart-submit"
		><?php echo wp_kses_post( $attributes['text'] ?? __( 'Purchase', 'surecart' ) ); ?></sc-order-submit>
		<?php
		return ob_get_clean();
	}
}
