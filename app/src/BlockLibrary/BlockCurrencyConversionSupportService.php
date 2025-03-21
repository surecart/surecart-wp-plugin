<?php

namespace SureCart\BlockLibrary;

/**
 * Provide anchor support for blocks.
 */
class BlockCurrencyConversionSupportService {
	/**
	 * Register block support.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'pre_render_block', [ $this, 'applySupport' ], 10, 2 );
	}

	/**
	 * Apply the currency conversion support.
	 *
	 * @param string $pre_render Pre-render content.
	 * @param array  $parsed_block Parsed block.
	 *
	 * @return string
	 */
	public function applySupport( $pre_render, $parsed_block ) {
		// Get the block type object.
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $parsed_block['blockName'] );

		// Should the block convert currency? (either true or false).
		$support = $block_type->supports['currencyConversion'] ?? null;

		if ( ! empty( $block_type ) && null !== $support ) {
			\SureCart::currency()->convert( wp_validate_boolean( $support ) );
		}

		// Returning '' means "go ahead and render normally".
		return $pre_render;
	}
}
