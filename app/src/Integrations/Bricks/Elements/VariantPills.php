<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Integrations\Bricks\Concerns\NestableBlockChildren;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Variant Pills element.
 */
class VariantPills extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.
	use NestableBlockChildren;

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
	public $name = 'surecart-product-variant-pills';

	/**
	 * Element block name
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-variant-pills';

	/**
	 * Element icon
	 *
	 * @var string
	 */
	public $icon = 'ion-md-options';

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
		return esc_html__( 'Product Variant Pills', 'surecart' );
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			$output  = '<label class="sc-form-label">' . esc_html__( 'Color', 'surecart' ) . '</label>';
			$output .= '<div class="sc-pill-option__wrapper">';
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</div>';

			echo $this->preview_layout(// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$output,
				'wp-block-surecart-product-variant-pills'
			);
		}

		echo $this->raw_layout(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
