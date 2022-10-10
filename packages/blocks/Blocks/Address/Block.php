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
		$default_country = $attributes['default_country'] ?? \SureCart::account()->tax_protocol->address->country ?? \SureCart::account()->brand->address->country ?? null;
		ob_start(); ?>

		<sc-order-shipping-address
			label="<?php echo esc_attr( $attributes['label'] ); ?>"
			<?php echo $attributes['full'] ? 'full' : null ?>
			<?php echo $attributes['show_name'] ? 'show-name' : null ?>
			default-country="<?php echo esc_attr( $default_country ); ?>"
		></sc-order-shipping-address>

		<?php
		return ob_get_clean();
	}
}
