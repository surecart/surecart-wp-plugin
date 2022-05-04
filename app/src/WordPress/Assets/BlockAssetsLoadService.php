<?php

namespace SureCart\WordPress\Assets;

/**
 * Controls when to enqueue a script based on block render.
 */
class BlockAssetsLoadService {
	/**
	 * Runs a callback when a block is rendered.
	 * Typical usage: scripts to be enqueued using this function will only get printed
	 * when the block gets rendered on the frontend.
	 *
	 * @param string        $block_name The block name, including namespace.
	 * @param callable|null $enqueue_callback A function to run when the block is rendered.
	 *
	 * @return void
	 */
	public function whenRendered( $block_name, $enqueue_callback = null ) {
		/**
		 * Callback function to when a block is rendered.
		 * Typically to enqueue scripts when needed.
		 *
		 * @param string $content When the callback is used for the render_block filter,
		 *                        the content needs to be returned so the function parameter
		 *                        is to ensure the content exists.
		 * @return string Block content.
		 */
		$callback = static function( $content, $block ) use ( $block_name, $enqueue_callback ) {
			// Sanity check.
			if ( empty( $block['blockName'] ) || $block_name !== $block['blockName'] ) {
				return $content;
			}

			// Run the callback.
			if ( ! empty( $enqueue_callback ) ) {
				call_user_func( $enqueue_callback, $content, $block );
			}

			// Return the content.
			return $content;
		};

		/*
		 * The filter's callback here is an anonymous function because
		 * using a named function in this case is not possible.
		 *
		 * The function cannot be unhooked, however, users are still able
		 * to dequeue the script registered/enqueued by the callback
		 * which is why in this case, using an anonymous function
		 * was deemed acceptable.
		 */
		add_filter( 'render_block', $callback, 10, 2 );
	}
}
