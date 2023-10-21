<?php

declare(strict_types=1);

namespace SureCart\BlockValidator;

/**
 * Class BlockValidator
 *
 * Validate and render blocks.
 *
 * @package SureCart\BlockValidator
 */
abstract class BlockValidator {
	/**
	 * The block to search for.
	 *
	 * @var string
	 */
	protected string $searched_block;

	/**
	 * Validate block.
	 *
	 * The child class should implement this method.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block The block.
	 *
	 * @return bool
	 */
	abstract protected function validate( string $block_content, array $block): bool;

	/**
	 * Render block.
	 *
	 * The child class should implement this method.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block The block.
	 *
	 * @return string
	 */
	abstract protected function render( string $block_content, array $block ): string;

	/**
	 * Validate and render block.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block The block.
	 *
	 * @return string
	 */
	public function validateAndRender( string $block_content, array $block ): string {
		// If the block is not valid, return the original content.
		if ( ! $this->validate( $block_content, $block ) ) {
			return $block_content;
		}

		// Render the block - This should be implemented by the child class.
		return $this->render( $block_content, $block );
	}

	/**
	 * Get block content of a template from model.
	 *
	 * @param \SureCart\Models\Model $model The model, eg. Product, ProductCollection, etc.
	 *
	 * @return string
	 */
	public function getBlockContent( \SureCart\Models\Model $model ): string {
		return wp_is_block_theme() ?
			$model->template->content ?? '' :
			$model->template_part->content ?? '';
	}
}
