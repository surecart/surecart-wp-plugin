<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Product Name element.
 */
class BundleProductName extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Elements';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-bundle-product-name';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/bundle-product-name';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-pricetag';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Bundle Product Name', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html__( 'Product Name', 'surecart' ),
				'sc-bundle-item__product-name wp-block-surecart-bundle-product-name',
				'span'
			);
			return;
		}

		echo $this->raw(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
