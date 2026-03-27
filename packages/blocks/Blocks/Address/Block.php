<?php

namespace SureCartBlocks\Blocks\Address;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Address Block.
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
		$default_country = $attributes['default_country'] ?? null;

		ob_start(); ?>
		<sc-order-shipping-address
			label="<?php echo esc_attr( $attributes['label'] ); ?>"
			<?php echo $attributes['full'] ? 'full' : null; ?>
			<?php echo $attributes['show_name'] ? 'show-name' : null; ?>
			<?php echo $attributes['line_2'] ? 'show-line-2' : null; ?>
			required="<?php echo false === $attributes['required'] ? 'false' : 'true'; ?>"
			default-country="<?php echo esc_attr( $default_country ); ?>"
		></sc-order-shipping-address>
		<?php

		if ( $attributes['collect_billing'] ) {
			?>
			<sc-order-billing-address
			label="<?php echo esc_attr( $attributes['billing_label'] ); ?>"
			toggle-label="<?php echo esc_attr( $attributes['billing_toggle_label'] ); ?>"
			<?php echo $attributes['show_name'] ? 'show-name' : null; ?>
			<?php echo $attributes['line_2'] ? 'show-line-2' : null; ?>
			default-country="<?php echo esc_attr( $default_country ); ?>"
		></sc-order-billing-address>
			<?php
		}

		return ob_get_clean();
	}
}
