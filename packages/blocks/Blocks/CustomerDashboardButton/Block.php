<?php

namespace CheckoutEngineBlocks\Blocks\CustomerDashboardButton;

use CheckoutEngineBlocks\Blocks\BaseBlock;
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
		$href = \CheckoutEngine::pages()->url( 'dashboard' );

		ob_start(); ?>

		<ce-button href="<?php echo esc_url( $href ); ?>" type="<?php echo esc_attr( $attributes['type'] ?? 'primary' ); ?>" size="<?php echo esc_attr( $attributes['size'] ?? 'medium' ); ?>">
			<?php if ( ! empty( $attributes['show_icon'] ) ) : ?>
				<ce-icon name="user" style="font-size: 18px" slot="prefix"></ce-icon>
			<?php endif; ?>
			<?php echo esc_html( $attributes['label'] ?? __( 'Dashboard', 'surecart' ) ); ?>
		</ce-button>

		<?php
		return ob_get_clean();
	}
}
