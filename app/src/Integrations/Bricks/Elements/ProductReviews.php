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
				'label'    => esc_html__( 'Reviews Container', 'surecart' ),
				'settings' => [
					'_direction' => 'column',
					'_rowGap'    => '30px',
				],
				'children' => [
					[
						'name'     => 'block',
						'label'    => esc_html__( 'Rating Summary', 'surecart' ),
						'settings' => [
							'_direction'     => 'row',
							'_alignItems'    => 'flex-start',
							'_columnGap'     => '30px',
							'_justifyContent' => 'space-between',
						],
						'children' => [
							[
								'name'     => 'block',
								'label'    => esc_html__( 'Rating Info', 'surecart' ),
								'settings' => [
									'_direction' => 'column',
									'_rowGap'    => '10px',
								],
								'children' => [
									[ 'name' => 'surecart-product-review-average-rating-value' ],
									[ 'name' => 'surecart-product-review-average-rating-stars' ],
									[ 'name' => 'surecart-product-review-total-rating' ],
								],
							],
							[ 'name' => 'surecart-product-review-breakdown' ],
						],
					],
					[ 'name' => 'surecart-product-review-list' ],
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
		echo $this->html( [], \Bricks\Frontend::render_children( $this ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
