<?php

namespace SureCartBlocks\Blocks;

use SureCartCore\Application\Application;

/**
 * Provide general block-related functionality.
 */
class BlockService {
	/**
	 * View engine.
	 *
	 * @var Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param Application $app Application Instance.
	 */
	public function __construct( Application $app ) {
		$this->app = $app;
	}

	/**
	 * Render a block using a template
	 *
	 * @param  string|string[]      $views A view or array of views.
	 * @param  array<string, mixed> $context Context to send.
	 * @return string View html output.
	 */
	public function render( $views, $context = [] ) {
		return apply_filters( 'surecart_block_output', $this->app->views()->make( $views )->with( $context )->toString() );
	}

	/**
	 * Find all blocks and nested blocks by name.
	 *
	 * @param  string $type Block item to filter by.
	 * @param  string $name Block name.
	 * @param   array  $blocks Array of blocks.
	 * @return array
	 */
	public function filterBy( $type, $name, $blocks ) {
		$found_blocks = [];
		$blocks       = (array) $blocks;
		foreach ( $blocks as $block ) {
			if ( $name === $block[ $type ] ) {
				$found_blocks[] = $block;
			}
			if ( ! empty( $block['innerBlocks'] ) ) {
				$found_blocks = array_merge( $found_blocks, $this->filterBy( $type, $name, $block['innerBlocks'] ) );
			}
		}
		return $found_blocks;
	}

	/**
	 * Append a block to blocks array by searching a block.
	 *
	 * @param array  $blocks              Blocks array.
	 * @param string $searched_block_name Searched block name.
	 * @param array  $appended_block      Appended block.
	 *
	 * @return array $blocks
	 */
	public function appendBlock( array $blocks, string $searched_block_name, array $appended_block ): array {
		foreach ( $blocks as $index => &$block ) {
			// Check if the current block is the target block.
			if ( isset( $block['blockName'] ) && $block['blockName'] === $searched_block_name ) {
				// Split the blocks into two parts before and after the target block.
				$before = array_slice( $blocks, 0, $index );
				$after  = array_slice( $blocks, count( $before ) );

				// Merge the blocks with the appended block.
				$blocks = array_merge( $before, [ $appended_block ], $after );

				// Stop the loop.
				break;
			}

			// Check innerBlocks recursively.
			if ( is_array( $block['innerBlocks'] ?? null ) ) {
				$blocks[ $index ]['innerBlocks'] = $this->appendBlock($block['innerBlocks'], $searched_block_name, $appended_block );
			}
		}

		return $blocks;
	}
}
