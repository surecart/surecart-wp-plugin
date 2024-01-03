<?php

namespace SureCartBlocks\Blocks\Upsell\Description;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Upsell Description Block
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
		$upsell = get_query_var( 'surecart_current_upsell' );
		if ( empty( $upsell->metadata->description ?? '' ) ) {
			return '';
		}
		ob_start(); ?>

		<div class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php echo wp_kses_post( $upsell->metadata->description ?? '' ); ?>
		</div>

		<?php
		return ob_get_clean();
	}
}
