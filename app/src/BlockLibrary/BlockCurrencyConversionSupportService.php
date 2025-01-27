<?php

namespace SureCart\BlockLibrary;

/**
 * Provide anchor support for blocks.
 */
class BlockCurrencyConversionSupportService {
	/**
	 * Apply the currency conversion support.
	 *
	 * @param string $pre_render Pre-render content.
	 * @param array  $parsed_block Parsed block.
	 *
	 * @return string
	 */
	public function applySupport( $pre_render, $parsed_block ) {
		// Short-circuit if we've already got content (someone else may have filtered).
		if ( ! empty( $pre_render ) ) {
			return $pre_render;
		}

		// Get the block type object.
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $parsed_block['blockName'] );

		// Should the block convert currency? (either true or false)
		$support = $block_type->supports['currencyConversion'] ?? null;

		if ( ! empty( $block_type ) && null !== $support ) {
			\SureCart::currency()->convert( wp_validate_boolean( $support ) );
		}

		// Returning '' means "go ahead and render normally".
		return $pre_render;
	}

	/**
	 * Reset currency conversion after block render.
	 *
	 * @param string $block_content The block content about to be rendered.
	 * @return string
	 */
	public function resetSupport( $block_content ) {
		\SureCart::currency()->convert( false );
		return $block_content;
	}

	/**
	 * Register block support.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'pre_render_block', [ $this, 'applySupport' ], 10, 2 );
		// add_filter( 'render_block', [ $this, 'resetSupport' ], 99999 );
	}
}
