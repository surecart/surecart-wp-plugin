<?php


namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;
use SureCart\Integrations\Bricks\Concerns\NestableBlockChildren;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Choice Template element.
 */
class PriceChoiceTemplate extends \Bricks\Element {
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
	public $name = 'surecart-product-price-choice-template';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-price-choice-template';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'fas fa-money-bill-1';

	/**
	 * This is nestable.
	 *
	 * @var bool
	 */
	public $nestable = true;

	/**
	 * Constructor.
	 *
	 * @param array $element Element.
	 *
	 * @return void
	 */
	public function __construct( $element = null ) {
		$element['settings']['_gap'] = '0';
		parent::__construct( $element );
	}

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Price', 'surecart' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['highlight_border'] = array(
			'label' => esc_html__( 'Highlight Border', 'surecart' ),
			'type'  => 'color',
		);
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		$settings = array(
			'_typography' => array(
				'text-align' => 'right',
			),
		);

		return array(
			array(
				'name'     => 'surecart-product-price-name',
				'settings' => array(
					'_width' => '50%',
				),
			),
			array(
				'name'     => 'block',
				'settings' => array(
					'display'     => 'flex',
					'_direction'  => 'column',
					'_alignItems' => 'flex-end',
					'_width'      => '50%',
				),
				'children' => array(
					array(
						'name'     => 'surecart-product-price-amount',
						'settings' => $settings,
					),
					array(
						'name'     => 'surecart-product-price-trial',
						'settings' => $settings,
					),
					array(
						'name'     => 'surecart-product-price-setup-fee',
						'settings' => $settings,
					),
				),
			),
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( $this->is_admin_editor() ) {
			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				\Bricks\Frontend::render_children( $this ),
				'sc-choice'
			);
			return;
		}

		echo $this->raw( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'highlight_border' => $this->settings['highlight_border']['hex'] ?? '',
			],
			\Bricks\Frontend::render_children( $this )
		);
	}
}
