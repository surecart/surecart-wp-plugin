<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Collection Tags element.
 */
class CollectionTags extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'surecart';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-collection-tags';

	/**
	 * Element block name
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-collection-tags';

	/**
	 * Element icon
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-slider-alt';

	/**
	 * This is nestable.
	 *
	 * @var string
	 */
	public $nestable = true;

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-collection-tags';

	/**
	 * Get element label
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Collection Tags', 'surecart' );
	}

	/**
	 * Template for the product.
	 *
	 * @return string
	 */
	public function get_nestable_item() {
		return [
			[
				'name' => 'surecart-product-collection-tag',
			],
		];
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		return $this->get_nestable_item();
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['count'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Number to display', 'surecart' ),
			'type'        => 'number',
			'default'     => 1,
			'min'         => 1,
			'placeholder' => 1,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		echo "<div {$this->render_attributes( '_root' )}>" . $this->raw(  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'count' => $this->settings['count'],
			],
			\Bricks\Frontend::render_children( $this )
		) . '</div>';
	}
}
