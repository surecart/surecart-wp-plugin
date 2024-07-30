<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Collection Tags element.
 */
class CollectionTag extends \Bricks\Element {
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
	public $name = 'surecart-product-collection-tag';

	/**
	 * Element block name
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-collection-tag';

	/**
	 * Element icon
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-slider-alt';

	/**
	 * The css selector.
	 *
	 * @var string
	 */
	public $css_selector = '.wp-block-surecart-product-collection-tag';

	/**
	 * Get element label
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Collection Tag', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( ! bricks_is_frontend() ) {
			echo <<<HTML
				<span>hello html</span>
			HTML;
			return;
		}

		echo "<span {$this->render_attributes( '_root' )}>" . $this->raw() . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
