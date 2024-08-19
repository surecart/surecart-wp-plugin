<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product element.
 */
class Product extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the bricks class.

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
	public $name = 'surecart-product-page';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-page';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-shopping-cart';

	/**
	 * This is nestable.
	 *
	 * @var bool
	 */
	public $nestable = true;

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		$row_block_settings = array(
			'_direction'      => 'row',
			'_justifyContent' => 'flex-start',
			'_alignItems'     => 'baseline',
			'_columnGap'      => '0.5em',
		);

		$selected_price_template = array(
			array(
				'name'     => 'block',
				'settings' => $row_block_settings,
				'children' => array(
					array( 'name' => 'surecart-product-selected-price-scratch-amount' ),
					array( 'name' => 'surecart-product-selected-price-amount' ),
					array( 'name' => 'surecart-product-selected-price-interval' ),
					array( 'name' => 'surecart-product-sale-badge' ),
				),
			),
			array(
				'name'     => 'block',
				'settings' => $row_block_settings,
				'children' => array(
					array( 'name' => 'surecart-product-selected-price-trial' ),
					array( 'name' => 'surecart-product-selected-price-fees' ),
				),
			),
		);

		$left_column_children = array(
			array( 'name' => 'surecart-product-media' ),
		);

		$price_choice_template_settings = array(
			'_typography' => array(
				'text-align' => 'right',
			),
		);

		$right_column_children = array(
			array(
				'name'     => 'surecart-product-collection-tags',
				'children' => array(
					array(
						'name'     => 'surecart-product-collection-tag',
						'settings' => array(
							'_width' => 'max-content',
						),
					),
				),
			),
			array( 'name' => 'post-title' ),
			array(
				'name'     => 'surecart-product-selected-price',
				'children' => $selected_price_template,
			),
			array( 'name' => 'post-excerpt' ),
			array(
				'name'     => 'surecart-product-price-chooser',
				'children' => array(
					array(
						'name'     => 'surecart-product-price-choice-template',
						'settings' => array(
							'_display'        => 'flex',
							'_direction'      => 'row',
							'_justifyContent' => 'flex-start',
							'_alignItems'     => 'center',
							'_width'          => '100%',
							'_gap'            => '0',
						),
						'children' => array(
							array(
								'name'     => 'surecart-product-price-name',
								'settings' => array(
									'_width'     => '50%',
									'_flexBasis' => '50%',
								),
							),
							array(
								'name'     => 'block',
								'settings' => array(
									'display'     => 'flex',
									'_direction'  => 'column',
									'_alignItems' => 'flex-end',
									'_width'      => '50%',
									'_flexBasis'  => '50%',
								),
								'children' => array(
									array(
										'name'     => 'surecart-product-price-amount',
										'settings' => $price_choice_template_settings,
									),
									array(
										'name'     => 'surecart-product-price-trial',
										'settings' => $price_choice_template_settings,
									),
									array(
										'name'     => 'surecart-product-price-setup-fee',
										'settings' => $price_choice_template_settings,
									),
								),
							),
						),
					),
				),
			),
			array(
				'name'     => 'surecart-product-variant-pills',
				'children' => array(
					array( 'name' => 'surecart-product-variant-pill' ),
				),
			),
			array( 'name' => 'surecart-product-quantity' ),
			array( 'name' => 'surecart-product-buy-button' ),
		);

		return array(
			array(
				'name'     => 'container',
				'settings' => array(
					'_direction' => 'row',
					'_columnGap' => '60px',
					'_rowGap'    => '30px',
				),
				'children' => array(
					array(
						'name'     => 'block',
						'label'    => esc_html__( 'Column', 'surecart' ),
						'settings' => array(
							'_width'                  => '50%',
							'_width:mobile_portrait'  => '100%',
							'_width:mobile_landscape' => '100%',
						),
						'children' => $left_column_children,
					),
					array(
						'name'     => 'block',
						'label'    => esc_html__( 'Column', 'surecart' ),
						'settings' => array(
							'_width'                  => '50%',
							'_width:mobile_portrait'  => '100%',
							'_width:mobile_landscape' => '100%',
							'_direction'              => 'column',
							'_rowGap'                 => '0.75em',
						),
						'children' => $right_column_children,
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
		echo $this->html( [], \Bricks\Frontend::render_children( $this ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
