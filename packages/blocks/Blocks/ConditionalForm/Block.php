<?php

namespace SureCartBlocks\Blocks\ConditionalForm;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Cart CTA Block.
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 * @param object $block Block object.
	 *
	 * @return string
	 */
	public function render( $attributes, $content, $block = null ) {

		\SureCart::assets()->addComponentData(
			'sc-conditional-form',
			'#sc-conditional-form-1',
			[
				'rule_groups' => $attributes['rule_groups']
			]
		);

		// var_dump( $attributes );

		return $content;

		// return "Sandesh";
		ob_start(); ?>
		<sc-conditional-form rule_groups={ JSON.stringify( rule_groups ) }>$content</sc-conditional-form>
		<div>I am a conditional form</div>
		<?php /*<sc-flex
			slot="<?php echo esc_attr( 'cart-' . ( $attributes['slot'] ?? 'header' ) ); ?>"
			justify-content="space-between"
			align-items="center">
			<sc-text style="--font-size: var(--sc-font-size-x-small); --line-height: var(--sc-line-height-dense); --color: var(--sc-color-gray-700)">
				<?php echo wp_kses_post( $attributes['text'] ?? '' ); ?>
			</sc-text>
			<sc-button href="#" size="small" type="primary">Try It</sc-button>
		</sc-flex>
		*/ ?>
		<?php
		return ob_get_clean();
	}
}
