<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Reviews element.
 */
class ProductReviews extends \Bricks\Element {
	use ConvertsBlocks;

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Layout';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-reviews';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-reviews';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-comments';

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
		return esc_html__( 'Product Reviews', 'surecart' );
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		return [
			[
				'name'     => 'block',
				'label'    => esc_html__( 'Product Reviews', 'surecart' ),
				'children' => [
					[
						'name'     => 'container',
						'label'    => esc_html__( 'Rating Summary', 'surecart' ),
						'settings' => [
							'_direction'  => 'column',
							'_alignItems' => 'flex-start',
						],
						'children' => [
							[
								'name'     => 'heading',
								'settings' => [
									'text'    => esc_html__( 'Customer Reviews', 'surecart' ),
									'tag'     => 'h2',
									'_margin' => [
										'bottom' => '20',
									],
								],
							],
							[
								'name'     => 'container',
								'label'    => esc_html__( 'Rating Summary', 'surecart' ),
								'settings' => [
									'_direction'      => 'row',
									'_alignItems'     => 'flex-start',
									'_columnGap'      => '30px',
									'_justifyContent' => 'space-between',
									'_padding'        => '20px',
									'_background'     => [
										'color' => [ 'hex' => '#f5f5f5' ],
									],
								],
								'children' => [
									[
										'name'     => 'block',
										'label'    => esc_html__( 'Rating Info', 'surecart' ),
										'settings' => [
											'_direction' => 'column',
											'_rowGap'    => '10px',
											'_width'     => '50%',
										],
										'children' => [
											[
												'name'     => 'surecart-product-review-average-rating-value',
												'settings' => [
													'format_style' => 'slash',
													'_typography' => array(
														'font-size' => '2em',
														'font-weight' => '600',
													),
												],
											],
											[ 'name' => 'surecart-product-review-average-rating-stars' ],
											[ 'name' => 'surecart-product-review-total-rating' ],
										],
									],
									[
										'name'     => 'surecart-product-review-breakdown',
										'settings' => [
											'columns'    => 1,
											'row_gap'    => 2,
											'column_gap' => 20,
											'star_label_gap' => 4,
											'_width'     => '50%',
											'star_size'  => 20,
											'bar_fill_color' => [
												'hex' => 'var(--bricks-color-primary)',
											],
											'bar_background_color' => [
												'hex' => '#e0e0e0',
											],
										],
									],
								],
							],
							[ 'name' => 'surecart-product-review-list' ],
						],
					],
				],
			],
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$output = "<div {$this->render_attributes( '_root' )}>";

		// Render children elements (= individual items).
		$output .= \Bricks\Frontend::render_children( $this );

		$output .= '</div>';

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
