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
	public $icon = 'ti-layout-grid2';

	/**
	 * This is nestable.
	 *
	 * @var string
	 */
	public $nestable = true;

	/**
	 * Get element label
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Collection Tags', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array[]
	 */
	public function get_nestable_children() {
		$count    = $this->settings['count'] ?? 1;
		$children = array();

		for ( $i = 0; $i < $count; $i++ ) {
			$children[] = array(
				'name'     => 'surecart-product-collection-tag',
				'settings' => array(
					'_width' => 'max-content',
				),
			);
		}

		return $children;
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
		if ( $this->is_admin_editor() ) {
			echo $this->preview_layout( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				\Bricks\Frontend::render_children( $this ),
			);
			return;
		}

		echo $this->raw_layout(
			[
				'count' => $this->settings['count'],
			]
		);
	}
}
