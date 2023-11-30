<?php

namespace SureCartBlocks\Blocks\ProductDonationAmounts;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Title Block
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
		$wrapper_attributes = get_block_wrapper_attributes(
			[
				'style' => implode(
					' ',
					[
						'border: none;',
						esc_attr( $this->getVars( $attributes, '--sc-choice' ) ),
						'--columns:' . intval( $attributes['columns'] ) . ';',
						$this->getSpacingPresetCssVar( $attributes['style']['spacing']['blockGap'] ) ? '--sc-choices-gap:' . $this->getSpacingPresetCssVar( $attributes['style']['spacing']['blockGap'] ) . ';' : '',
					]
				),
			]
		);

		return wp_sprintf(
			'<div %s>
				<sc-choices label="%s">
					%s
				</sc-choices>
			</div>',
			$wrapper_attributes,
			esc_attr( $attributes['label'] ),
			filter_block_content( $content )
		);
	}
}
