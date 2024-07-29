<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Media element.
 */
class Media extends \Bricks\Element {
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
	public $name = 'surecart-product-media';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-media';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-slider-alt';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product media', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['auto_height'] = [
			'tab'        => 'content',
			'label'      => esc_html__( 'Auto height', 'surecart' ),
			'type'       => 'checkbox',
			'inline'     => true,
			'fullAccess' => true,
			'default'    => true,
		];

		$this->controls['height'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Height', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '310px',
			'placeholder' => '310px',
			'required'    => [
				[ 'auto_height', '!=', true ],
			],
			'fullAccess'  => true,
		];

		$this->controls['max_image_width'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Max image width', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'placeholder' => esc_html__( 'Unlimited', 'surecart' ),
		];

		$this->controls['thumbnails_per_page'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Thumbs per page', 'surecart' ),
			'type'        => 'number',
			'default'     => 5,
			'min'         => 2,
			'placeholder' => 5,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'auto_height'         => (bool) $this->settings['auto_height'],
				'height'              => esc_html( $this->settings['height'] ),
				'width'               => esc_html( $this->settings['max_image_width'] ?? null ),
				'thumbnails_per_page' => (int) $this->settings['thumbnails_per_page'],
			]
		);
	}
}
