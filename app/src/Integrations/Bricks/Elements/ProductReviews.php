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
						'label'    => esc_html__( 'Review List', 'surecart' ),
						'settings' => [
							'_direction'  => 'column',
							'_alignItems' => 'flex-start',
							'_padding'    => [
								'top'    => '0',
								'right'  => '0',
								'bottom' => '0',
								'left'   => '0',
							],
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
							// Product Review Content - conditional wrapper (only renders when reviews exist).
							// Contains only the summary/breakdown - NOT the review list.
							[
								'name'     => 'surecart-product-review-content',
								'label'    => esc_html__( 'Review Content', 'surecart' ),
								'children' => [
									// Review Summary.
									[
										'name'     => 'container',
										'label'    => esc_html__( 'Review Summary', 'surecart' ),
										'settings' => [
											'_direction'  => 'row',
											'_alignItems' => 'center',
											'_columnGap'  => '30px',
											'_justifyContent' => 'space-between',
											'_alignSelf'  => 'stretch',
											'_margin'     => [
												'top'    => '0',
												'right'  => '0',
												'bottom' => '20px',
												'left'   => '0',
											],
											'_padding'    => [
												'top'    => '0',
												'right'  => '0',
												'bottom' => '0',
												'left'   => '0',
											],
										],
										'children' => [
											[
												'name'     => 'container',
												'label'    => esc_html__( 'Product Rating', 'surecart' ),
												'settings' => [
													'_direction'      => 'column',
													'_rowGap'         => '10px',
													'_justifyContent' => 'center',
													'_flexShrink'     => 0,
													'_flexGrow'       => 0,
													'_width'          => '180px',
													'_padding'        => [
														'top'    => '0',
														'right'  => '0',
														'bottom' => '0',
														'left'   => '0',
													],
												],
												'children' => [
													[
														'name'     => 'surecart-product-review-average-rating-value',
														'settings' => [
															'format_style' => 'slash',
															'_typography'  => [
																'font-size'   => '30px',
																'font-weight' => '600',
															],
														],
													],
													[
														'name'     => 'surecart-product-review-average-rating-stars',
														'settings' => [
															'fill_color' => [
																'hex' => 'var(--bricks-color-primary)',
															],
														],
													],
													[
														'name'     => 'container',
														'label'    => esc_html__( 'Product Total Rating', 'surecart' ),
														'settings' => [
															'_direction'      => 'row',
															'_columnGap'      => '4px',
															'_alignItems'     => 'flex-start',
															'_justifyContent' => 'flex-start',
															'_margin'         => [
																'top'    => '0',
																'right'  => '0',
																'bottom' => '0',
																'left'   => '0',
															],
															'_padding'        => [
																'top'    => '0',
																'right'  => '0',
																'bottom' => '0',
																'left'   => '0',
															],
															'_width'          => 'auto',
														],
														'children' => [
															[
																'name'     => 'text-basic',
																'settings' => [
																	'text'        => esc_html__( 'Based on', 'surecart' ),
																	'_typography' => [
																		'font-size'   => '14px',
																		'font-weight' => '400',
																	],
																],
															],
															[
																'name'     => 'surecart-product-review-total-rating',
																'settings' => [
																	'show_label'  => true,
																	'_typography' => [
																		'font-size' => '14px',
																	],
																],
															],
														],
													],
												],
											],
											[
												'name'     => 'container',
												'label'    => esc_html__( 'Breakdowns', 'surecart' ),
												'settings' => [
													'_flexGrow'   => 1,
													'_flexShrink' => 1,
													'_flexBasis'  => '0%',
													'_maxWidth'   => '500px',
													'_overflow'   => 'hidden',
													'_alignItems' => 'flex-end',
												],
												'children' => [
													[
														'name'     => 'surecart-product-review-breakdown',
														'settings' => [
															'columns'        => 2,
															'row_gap'        => '2px',
															'column_gap'     => '40px',
															'fill_color'     => [
																'hex' => 'var(--bricks-color-primary)',
															],
															'bar_fill_color' => [
																'hex' => 'var(--bricks-color-primary)',
															],
														],
													],
												],
											],
										],
									],
								],
							],
							// Review List - OUTSIDE the conditional wrapper.
							// This element has its own internal "no reviews" handling.
							[
								'name'     => 'surecart-product-review-list',
								'settings' => [
									'_width'           => '100%',
									'show_header'      => true,
									'show_sidebar'     => true,
									'show_add_button'  => true,
									'show_review_date' => true,
									'show_content'     => true,
									'show_pagination'  => true,
									'fill_color'       => [
										'hex' => 'var(--bricks-color-primary)',
									],
								],
							],
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
