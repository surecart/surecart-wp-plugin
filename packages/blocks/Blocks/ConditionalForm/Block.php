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

		$id = wp_rand( 10000, 99999 );

		\SureCart::assets()->addComponentData(
			'sc-conditional-form',
			'#sc-conditional-form-' . $id,
			[
				'rule_groups' => $attributes['rule_groups']
			]
		);

		return '<sc-conditional-form id="sc-conditional-form-' . $id . '">' . $content . '</sc-conditional-form>';
	}
}
