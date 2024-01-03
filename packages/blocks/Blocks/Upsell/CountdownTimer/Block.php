<?php

namespace SureCartBlocks\Blocks\Upsell\CountdownTimer;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Upsell Count Down Timer Block.
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
		$bump = get_query_var( 'surecart_current_bump' );
		if ( empty( $bump ) ) {
			return '';
		}
		ob_start(); ?>

		<div class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
			<sc-order-bump-countdown-timer
				showIcon="<?php echo esc_attr( $attributes['showIcon'] ); ?>"
			>
				<span slot="offer-expire-text">
					<?php echo esc_attr( $attributes['offer_expire_text'] ?? '' ); ?>
				</span>
			</sc-order-bump-countdown-timer>
		</div>

		<?php
		return ob_get_clean();
	}
}
