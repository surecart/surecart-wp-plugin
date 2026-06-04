<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bundle Variant Name element.
 */
class BundleVariantName extends \Bricks\Element {
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
	public $name = 'surecart-bundle-variant-name';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/bundle-variant-name';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ion-md-text';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Bundle Variant Name', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['separator'] = array(
			'label'       => esc_html__( 'Separator', 'surecart' ),
			'type'        => 'text',
			'default'     => ' – ',
			'description' => esc_html__( 'Shown between the product name and the variant option name.', 'surecart' ),
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$separator = $this->settings['separator'] ?? ' – ';

		if ( $this->is_admin_editor() ) {
			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html( $separator ) . esc_html__( 'Variant Option Name', 'surecart' ),
				'sc-bundle-item__variant-name wp-block-surecart-bundle-variant-name',
				'span'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array(
				'separator' => $separator,
			)
		);
	}
}
