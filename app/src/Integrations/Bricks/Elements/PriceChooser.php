<?php


namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Price Selector element.
 */
class PriceChooser extends \Bricks\Element {
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
	public $name = 'surecart-product-price-chooser';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-price-chooser';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'fas fa-money-bills';

	/**
	 * This is nestable.
	 *
	 * @var bool
	 */
	public $nestable = true;

	/**
	 * The css selector.
	 *
	 * @var string
	 */

	/**
	 * The constructor.
	 *
	 * @param \Bricks\Element|null $element The element.
	 *
	 * @return void
	 */
	public function __construct( $element = null ) {
		$element['settings']['_width'] = '100%';
		parent::__construct( $element );
	}

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Price Chooser', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array[]
	 */
	public function get_nestable_children() {
		return array(
			array(
				'name'     => 'surecart-product-price',
				'settings' => array(
					'_display'        => 'flex',
					'_direction'      => 'row',
					'_justifyContent' => 'flex-start',
					'_alignItems'     => 'center',
					'_width'          => '100%',
				),
				'children' => array(
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
							array( 'name' => 'surecart-product-price-amount' ),
							array( 'name' => 'surecart-product-price-trial' ),
							array( 'name' => 'surecart-product-price-setup-fee' ),
						),
					),
				),
			),
		);
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['label'] = array(
			'label'   => esc_html__( 'Label', 'surecart' ),
			'type'    => 'text',
			'default' => esc_html__( 'Pricing', 'surecart' ),
		);
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		if ( bricks_is_builder_call() ) {
			$label   = ! empty( $this->settings['label'] ) ? $this->settings['label'] : esc_html__( 'Pricing', 'surecart' );
			$output  = "<div {$this->render_attributes( '_root' )}>";
			$output .= "<label class='sc-form-label'>" . $label . '</label>';
			$output .= "<div class='sc-choices'>";
			$output .= \Bricks\Frontend::render_children( $this );
			$output .= '</div>';
			$output .= '</div>';
			echo $output;
			return;
		}

		echo $this->raw_layout(
			[
				'label' => $this->settings['label'],
			]
		);
	}
}
