<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review List element.
 */
class ProductReviewList extends \Bricks\Element {
	use ConvertsBlocks;

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
	public $name = 'surecart-product-review-list';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-review-list';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-list';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Review List', 'surecart' );
	}

	/**
	 * Set control groups.
	 *
	 * @return void
	 */
	public function set_control_groups() {
		$this->control_groups['review_header'] = [
			'title' => esc_html__( 'Review Header', 'surecart' ),
			'tab'   => 'content',
		];

		$this->control_groups['review_button'] = [
			'title'    => esc_html__( 'Add Review Button', 'surecart' ),
			'tab'      => 'content',
			'required' => [ 'show_add_button', '=', true ],
		];

		$this->control_groups['review_item'] = [
			'title' => esc_html__( 'Review Item', 'surecart' ),
			'tab'   => 'content',
		];

		$this->control_groups['pagination'] = [
			'title' => esc_html__( 'Pagination', 'surecart' ),
			'tab'   => 'content',
		];
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['show_header'] = [
			'tab'     => 'content',
			'group'   => 'review_header',
			'label'   => esc_html__( 'Show Header', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_sidebar'] = [
			'tab'     => 'content',
			'group'   => 'review_header',
			'label'   => esc_html__( 'Show Filter & Sidebar', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_add_button'] = [
			'tab'     => 'content',
			'group'   => 'review_header',
			'label'   => esc_html__( 'Show Add Review Button', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['add_button_label'] = [
			'tab'      => 'content',
			'group'    => 'review_button',
			'label'    => esc_html__( 'Button Text', 'surecart' ),
			'type'     => 'text',
			'default'  => esc_html__( 'Write a Review', 'surecart' ),
			'required' => [ 'show_add_button', '=', true ],
		];

		$this->controls['add_button_icon_size'] = [
			'tab'         => 'content',
			'group'       => 'review_button',
			'label'       => esc_html__( 'Icon Size', 'surecart' ),
			'type'        => 'number',
			'default'     => 15,
			'min'         => 10,
			'max'         => 100,
			'step'        => 1,
			'required'    => [ 'show_add_button', '=', true ],
			'description' => esc_html__( 'Size of the icon in pixels.', 'surecart' ),
			'css'         => [
				[
					'property' => 'width',
					'selector' => '.wp-block-surecart-product-review-add-button svg',
				],
				[
					'property' => 'height',
					'selector' => '.wp-block-surecart-product-review-add-button svg',
				],
			],
		];

		$this->controls['add_button_text_color'] = [
			'tab'      => 'content',
			'group'    => 'review_button',
			'label'    => esc_html__( 'Button Text Color', 'surecart' ),
			'type'     => 'color',
			'reset'    => true,
			'required' => [ 'show_add_button', '=', true ],
			'default'  => [
				'hex' => '#000000',
			],
			'css'      => [
				[
					'property' => 'color',
					'selector' => '.wp-block-surecart-product-review-add-button',
				],
			],
		];

		$this->controls['add_button_background_color'] = [
			'tab'      => 'content',
			'group'    => 'review_button',
			'label'    => esc_html__( 'Button Background Color', 'surecart' ),
			'type'     => 'color',
			'reset'    => true,
			'required' => [ 'show_add_button', '=', true ],
			'default'  => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'css'      => [
				[
					'property' => 'background-color',
					'selector' => '.wp-block-surecart-product-review-add-button',
				],
			],
		];

		$this->controls['show_review_date'] = [
			'tab'     => 'content',
			'group'   => 'review_item',
			'label'   => esc_html__( 'Show Review Date', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_content'] = [
			'tab'     => 'content',
			'group'   => 'review_item',
			'label'   => esc_html__( 'Show Review Content', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['verified_badge_icon_size'] = [
			'tab'         => 'content',
			'group'       => 'review_item',
			'label'       => esc_html__( 'Verified Badge Icon Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => 16,
			'min'         => 10,
			'max'         => 50,
			'step'        => 1,
			'description' => esc_html__( 'Size of the verified badge icon in pixels.', 'surecart' ),
			'css'         => [
				[
					'property' => 'width',
					'selector' => '.wp-block-surecart-product-review-verified-badge svg',

				],
				[
					'property' => 'height',
					'selector' => '.wp-block-surecart-product-review-verified-badge svg',
				],
			],
		];

		$this->controls['fill_color'] = [
			'tab'     => 'content',
			'group'   => 'review_item',
			'label'   => esc_html__( 'Star Color', 'surecart' ),
			'type'    => 'color',
			'default' => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'reset'   => true,
			'css'     => [
				[
					'property' => 'fill',
					'selector' => '.sc-star-row__label__svg',
				],
				[
					'property' => 'stroke',
					'selector' => '.sc-star-row__label__svg',
				],
			],
		];

		// Star Icon size.
		$this->controls['star_size'] = [
			'tab'         => 'content',
			'group'       => 'review_item',
			'label'       => esc_html__( 'Star Icon Size', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => 20,
			'min'         => 10,
			'max'         => 100,
			'step'        => 1,
			'description' => esc_html__( 'Size of the star icon in pixels.', 'surecart' ),
			'css'         => [
				[
					'property' => 'width',
					'selector' => '.sc-star-row__label__svg',
				],
				[
					'property' => 'height',
					'selector' => '.sc-star-row__label__svg',
				],
			],
		];

		// Review border color.
		$this->controls['review_border_color'] = [
			'tab'     => 'content',
			'group'   => 'review_item',
			'label'   => esc_html__( 'Review Border Color', 'surecart' ),
			'type'    => 'color',
			'reset'   => true,
			'default' => [
				'hex' => '#e5e7eb',
			],
			'css'     => [
				[
					'property' => 'border-bottom-color',
					'selector' => '.wp-block-surecart-product-review-list .sc-product-review-link > .wp-block-group',
				],
			],
		];

		// Review spacing (padding top/bottom).
		$this->controls['review_spacing'] = [
			'tab'     => 'content',
			'group'   => 'review_item',
			'label'   => esc_html__( 'Review Spacing', 'surecart' ),
			'type'    => 'number',
			'units'   => true,
			'default' => 32,
			'min'     => 0,
			'max'     => 200,
			'css'     => [
				[
					'property' => 'padding-top',
					'selector' => '.wp-block-surecart-product-review-list .sc-product-review-link > .wp-block-group',
				],
				[
					'property' => 'padding-bottom',
					'selector' => '.wp-block-surecart-product-review-list .sc-product-review-link > .wp-block-group',
				],
			],
		];

		$this->controls['no_reviews_text'] = [
			'tab'         => 'content',
			'group'       => 'review_item',
			'label'       => esc_html__( 'No Reviews Text', 'surecart' ),
			'type'        => 'text',
			'default'     => esc_html__( 'No reviews yet, write one now?', 'surecart' ),
			'placeholder' => esc_html__( 'Enter text for when no reviews exist', 'surecart' ),
		];

		$this->controls['show_pagination'] = [
			'tab'     => 'content',
			'group'   => 'pagination',
			'label'   => esc_html__( 'Show Pagination', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$show_header     = ! empty( $this->settings['show_header'] );
		$show_sidebar    = ! empty( $this->settings['show_sidebar'] );
		$show_add_button = ! empty( $this->settings['show_add_button'] );
		$show_pagination = ! empty( $this->settings['show_pagination'] );
		$show_date       = ! empty( $this->settings['show_review_date'] );
		$show_content    = ! empty( $this->settings['show_content'] );
		$no_reviews_text = ! empty( $this->settings['no_reviews_text'] ) ? $this->settings['no_reviews_text'] : esc_html__( 'No reviews yet, write one now?', 'surecart' );

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $show_header, $show_sidebar, $show_add_button, $show_date, $show_content, $show_pagination );
			return;
		}

		echo do_blocks( $this->get_review_list_content( $show_header, $show_sidebar, $show_add_button, $show_pagination, $show_date, $show_content, $no_reviews_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Get the review list block content.
	 *
	 * @param bool   $show_header     Show header.
	 * @param bool   $show_sidebar    Show sidebar.
	 * @param bool   $show_add_button Show add button.
	 * @param bool   $show_pagination Show pagination.
	 * @param bool   $show_date       Show date.
	 * @param bool   $show_content    Show content.
	 * @param string $no_reviews_text No reviews text.
	 *
	 * @return string
	 */
	private function get_review_list_content( $show_header, $show_sidebar, $show_add_button, $show_pagination, $show_date, $show_content, $no_reviews_text ): string {
		$rendered_attributes = $this->get_block_rendered_attributes();

		$content = '<!-- wp:surecart/product-review-list {"metadata":{"categories":["surecart_review_list"],"patternName":"surecart-product-review-standard","name":"Default Review List"},"className":"' . esc_attr( $rendered_attributes['class'] ) . '","anchor":"' . esc_attr( $rendered_attributes['id'] ) . '"} -->';

		// Product Reviews wrapper - only shows content when reviews exist.
		$content .= '<!-- wp:surecart/product-reviews -->';

		// Header.
		if ( $show_header ) {
			$content .= '<!-- wp:group {"metadata":{"name":"Header"},"style":{"spacing":{"margin":{"bottom":"10px"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
			$content .= '<div class="wp-block-group" style="margin-bottom:10px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">';
			$content .= $show_sidebar ? '<!-- wp:surecart/product-review-list-sidebar-toggle {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->' : '&nbsp;';

			if ( $show_add_button ) {
				$content .= $this->get_review_add_button_content();
			}

			$content .= '</div><!-- /wp:group -->';
		}

		// Content with Sidebar.
		$content .= '<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->';
		$content .= '<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0">';

		// Sidebar.
		if ( $show_sidebar ) {
			$content .= '<!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"280px"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"30px"}},"layout":{"type":"flex","orientation":"vertical"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal"}}} /-->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags-template {"style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","orientation":"horizontal"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tag /-->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-tags-template -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline","fontWeight":"700","fontStyle":"normal"}},"fontSize":"small"} /-->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-tags -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"8px"}}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal"}}} /-->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"6px","margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","orientation":"vertical"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkbox /-->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-checkboxes -->';
			$content .= '<!-- /wp:surecart/product-review-list-sidebar -->';
		}

		// Review Template.
		$content .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->';
		$content .= '<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0">';
		$content .= $this->get_review_template_content( $show_date, $show_content );

		// Pagination (inside the content group).
		if ( $show_pagination ) {
			$content .= '<!-- wp:surecart/product-review-pagination {"style":{"spacing":{"margin":{"top":"30px","bottom":"30px"}}}} -->';
			$content .= '<!-- wp:surecart/product-review-pagination-previous /-->';
			$content .= '<!-- wp:surecart/product-review-pagination-numbers /-->';
			$content .= '<!-- wp:surecart/product-review-pagination-next /-->';
			$content .= '<!-- /wp:surecart/product-review-pagination -->';
		}

		$content .= '</div>';
		$content .= '<!-- /wp:group -->';
		$content .= '</div>';
		$content .= '<!-- /wp:group -->';

		// Close Product Reviews wrapper.
		$content .= '<!-- /wp:surecart/product-reviews -->';

		// No reviews content (outside of product-reviews wrapper).
		$content .= '<!-- wp:surecart/product-review-list-no-reviews -->';
		$content .= '<!-- wp:paragraph {"align":"left","placeholder":"Add text or blocks that will display when a query returns no reviews.","style":{"spacing":{"margin":{"bottom":"16px"}}}} -->';
		$content .= '<p class="has-text-align-left" style="margin-bottom:16px">' . esc_html( $no_reviews_text ) . '</p><!-- /wp:paragraph -->';
		$content .= '<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';

		// no-reviews button with configured attributes.
		$content .= '<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0">' . $this->get_review_add_button_content() . '</div><!-- /wp:group -->';
		$content .= '<!-- /wp:surecart/product-review-list-no-reviews -->';

		$content .= '<!-- /wp:surecart/product-review-list -->';

		return $content;
	}

	/**
	 * Get the review template block content.
	 *
	 * @param bool $show_date    Show date.
	 * @param bool $show_content Show content.
	 *
	 * @return string
	 */
	private function get_review_template_content( $show_date, $show_content ): string {
		$fill_color = empty( $this->get_raw_color( 'fill_color' ) ) ? 'var(--bricks-color-primary)' : $this->get_raw_color( 'fill_color' );
		$star_size  = ! empty( $this->settings['star_size'] ) ? absint( $this->settings['star_size'] ) : 20;

		$rating_star_attrs = [
			'fill_color' => $fill_color,
			'size'       => $star_size,
			'style'      => [
				'spacing' => [
					'margin' => [
						'bottom' => '16px',
					],
				],
			],
		];

		$verified_icon_attrs = [
			'icon_size' => ! empty( $this->settings['verified_badge_icon_size'] ) ? absint( $this->settings['verified_badge_icon_size'] ) : 16,
		];

		$date_block    = $show_date ? '<!-- wp:surecart/product-review-date {"format":"human-diff"} /-->' : '';
		$content_block = $show_content ? '<!-- wp:surecart/product-review-content /-->' : '';

		// Use configured border color and spacing (fallbacks provided).
		$border_color = $this->get_raw_color( 'review_border_color' );
		if ( empty( $border_color ) ) {
			$border_color = '#e5e7eb';
		}

		$spacing = ! empty( $this->settings['review_spacing'] ) ? absint( $this->settings['review_spacing'] ) : 32;

		return '<!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->' .
			'<!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"top":"' . $spacing . 'px","bottom":"' . $spacing . 'px","right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"' . esc_attr( $border_color ) . '","width":"1px"}}},"layout":{"type":"constrained","contentSize":"100%"}} -->' .
			'<div class="wp-block-group" style="border-bottom-color:' . esc_attr( $border_color ) . ';border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:' . $spacing . 'px;padding-bottom:' . $spacing . 'px;padding-right:0px;padding-left:0px"><!-- wp:group {"className":"sc-review-header-group","style":{"spacing":{"margin":{"top":"0","bottom":"16px"},"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->' .
			'<div class="wp-block-group sc-review-header-group" style="margin-top:0;margin-bottom:16px;padding-right:0px;padding-left:0px"><!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->' .
			'<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px"><!-- wp:surecart/product-review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"right":"8px"}},"typography":{"fontStyle":"normal","fontWeight":"500"}}} /-->' .
			'<!-- wp:surecart/product-review-verified-badge ' . wp_json_encode( $verified_icon_attrs ) . ' /--></div>' .
			'<!-- /wp:group -->' . $date_block . '</div>' .
			'<!-- /wp:group -->' .
			'<!-- wp:surecart/product-review-rating-stars ' . wp_json_encode( $rating_star_attrs ) . ' /-->' .
			'<!-- wp:surecart/product-review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700","fontSize":"18px"},"spacing":{"margin":{"bottom":"8px"}}}} /-->' . $content_block . '</div>' .
			'<!-- /wp:group -->' .
			'<!-- /wp:surecart/product-review-template -->';
	}

	/**
	 * Get the review add button block content.
	 *
	 * @return string
	 */
	private function get_review_add_button_content(): string {
		$btn_attrs = [
			'width'     => 100,
			'label'     => ! empty( $this->settings['add_button_label'] ) ? wp_kses_post( $this->settings['add_button_label'] ) : esc_html__( 'Write a Review', 'surecart' ),
			'icon_size' => ! empty( $this->settings['add_button_icon_size'] ) ? absint( $this->settings['add_button_icon_size'] ) : 15,
			'style'     => [
				'color' => [
					'text'       => ! empty( $this->settings['add_button_text_color'] ) ? $this->get_raw_color( 'add_button_text_color' ) : '#000000',
					'background' => ! empty( $this->settings['add_button_background_color'] ) ? $this->get_raw_color( 'add_button_background_color' ) : 'var(--bricks-color-primary)',
				],
			],
		];

		return '<!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /-->';
	}

	/**
	 * Render preview in editor.
	 *
	 * @param bool $show_header     Show header.
	 * @param bool $show_sidebar    Show sidebar.
	 * @param bool $show_add_button Show add button.
	 * @param bool $show_date       Show date.
	 * @param bool $show_content    Show content.
	 * @param bool $show_pagination Show pagination.
	 *
	 * @return void
	 */
	private function render_preview( $show_header, $show_sidebar, $show_add_button, $show_date, $show_content, $show_pagination ) {
		$content    = '<div class="wp-block-surecart-product-review-list" style="width: 100%;">';
		$fill_color = $this->get_raw_color( 'fill_color' );
		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}

		// Header.
		if ( $show_header ) {
			$content .= '<div style="padding: 0; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">';

			if ( $show_sidebar ) {
				$content .= '<div style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">';
				$content .= wp_kses(
					\SureCart::svg()->get(
						'sliders',
						[
							'aria-label' => __( 'Open sidebar', 'surecart' ),
							'width'      => 16,
							'height'     => 16,
							'class'      => 'sc-sidebar-toggle__icon',
						]
					),
					sc_allowed_svg_html()
				);
				$content .= '<span>' . esc_html__( 'Filters', 'surecart' ) . '</span>';
				$content .= '</div>';
			} else {
				// Ensure left side still has something when no sidebar is shown.
				$content .= '&nbsp;';
			}

			if ( $show_add_button ) {
				$btn_icon_size  = ! empty( $this->settings['add_button_icon_size'] ) ? absint( $this->settings['add_button_icon_size'] ) : 15;
				$btn_label      = ! empty( $this->settings['add_button_label'] ) ? wp_kses_post( $this->settings['add_button_label'] ) : esc_html__( 'Write a Review', 'surecart' );
				$btn_bg_color   = ! empty( $this->settings['add_button_background_color'] ) ? $this->get_raw_color( 'add_button_background_color' ) : 'var(--bricks-color-primary)';
				$btn_text_color = ! empty( $this->settings['add_button_text_color'] ) ? $this->get_raw_color( 'add_button_text_color' ) : '#000000';
				$content       .= '<div style="padding: 10px 20px; border-radius: 50px; display: inline-flex; align-items: center; gap: 8px; background-color: ' . esc_attr( $btn_bg_color ) . '; color: ' . esc_attr( $btn_text_color ) . ';" class="wp-block-surecart-product-review-add-button">';
				$content       .= wp_kses(
					\SureCart::svg()->get(
						'edit-2',
						[
							'class'      => 'sc-add-review-button__icon',
							'aria-label' => __( 'Add Review', 'surecart' ),
							'width'      => $btn_icon_size,
							'height'     => $btn_icon_size,
						]
					),
					sc_allowed_svg_html()
				);
				$content       .= '<span>' . esc_html( $btn_label ) . '</span>';
				$content       .= '</div>';
			}

			$content .= '</div>';
		}

		// Main content area.
		$content .= '<div style="display: flex; gap: 30px; margin-bottom: 20px;">';

		// Sidebar.
		if ( $show_sidebar ) {
			$content .= '<div style="width: 250px; min-width: 250px;">';
			$content .= '<div style="margin-bottom: 20px;"><div style="font-weight: 600; margin-bottom: 10px;">' . esc_html__( 'Applied Filters', 'surecart' ) . '</div>';
			$content .= '<div style="display: flex; gap: 8px; flex-wrap: wrap;">';
			$content .= '<span style="padding: 6px 12px; background: #f3f4f6; border-radius: 16px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;">5 Stars';
			$content .= wp_kses(
				\SureCart::svg()->get(
					'x',
					[
						'class'      => 'sc-tag__clear',
						'aria-label' => __( 'Remove tag', 'surecart' ),
						'width'      => 12,
					]
				),
				sc_allowed_svg_html()
			);
			$content .= '</span></div>';
			$content .= '<div style="margin-top: 10px; text-decoration: underline; font-size: 14px; cursor: pointer; color: var(--bricks-color-primary, #6c63ff);">' . esc_html__( 'Clear All', 'surecart' ) . '</div>';
			$content .= '</div>';
			$content .= '<div><div style="font-weight: 600; margin-bottom: 12px;">' . esc_html__( 'Filter by', 'surecart' ) . '</div>';
			$content .= '<div style="display: flex; flex-direction: column; gap: 10px;">';
			for ( $i = 5; $i >= 1; $i-- ) {
				$content .= '<label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" style="width: 16px; height: 16px;"/><span>' . esc_html( $i . ' Stars' ) . '</span></label>';
			}
			$content .= '</div></div>';
			$content .= '</div>';
		}

		// Reviews.
		$content .= '<div style="flex: 1;">';
		// Preview values for border color and spacing.
		$preview_border_color = $this->get_raw_color( 'review_border_color' );
		if ( empty( $preview_border_color ) ) {
			$preview_border_color = '#e5e7eb';
		}
		$preview_spacing = ! empty( $this->settings['review_spacing'] ) ? absint( $this->settings['review_spacing'] ) : 32;
		for ( $i = 0; $i < 2; $i++ ) {
			// Each review link contains a wp-block-group that gets the border and spacing.
			$content .= '<div class="sc-product-review-link">';
			$content .= '<div class="wp-block-group" style="border-bottom: 1px solid ' . esc_attr( $preview_border_color ) . '; padding: ' . esc_attr( $preview_spacing ) . 'px 0; margin-top: 0; margin-bottom: 0;">';
			$content .= '<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">';
			$content .= '<div style="display: flex; gap: 10px; align-items: center;">';
			$content .= '<span style="font-weight: 500;">' . esc_html__( 'John Doe', 'surecart' ) . '</span>';
			$content .= '<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 14px;">';
			$content .= esc_html__( 'Verified Buyer', 'surecart' );
			$content .= wp_kses(
				\SureCart::svg()->get(
					'verified',
					[
						'class' => 'sc-verified-badge__icon',
					]
				),
				sc_allowed_svg_html()
			);
			$content .= '</span></div>';
			if ( $show_date ) {
				$content .= '<span style="color: #6b7280; font-size: 14px;">' . esc_html__( '2 days ago', 'surecart' ) . '</span>';
			}
			$content .= '</div>';

			// Stars.
			$content .= '<div style="display: inline-flex; gap: 2px; margin-bottom: 8px;" class="wp-block-surecart-product-review-rating-stars">';
			for ( $s = 1; $s <= 5; $s++ ) {
				$content .= wp_kses(
					\SureCart::svg()->get(
						'star',
						[
							'class' => 'sc-star-row__label__svg',
						]
					),
					sc_allowed_svg_html()
				);
			}
			$content .= '</div>';

			$content .= '<div style="font-weight: 700; margin-bottom: 8px;">' . esc_html__( 'Great Product!', 'surecart' ) . '</div>';
			if ( $show_content ) {
				$content .= '<p style="margin: 0; line-height: 1.6;">' . esc_html__( 'This is an excellent product. I highly recommend it to anyone looking for quality and reliability.', 'surecart' ) . '</p>';
			}
			$content .= '</div>'; // close .wp-block-group.
			$content .= '</div>'; // close .sc-product-review-link.
		}
		$content .= '</div>';

		$content .= '</div>';

		// Pagination.
		if ( $show_pagination ) {
			$prev_arrow = wp_kses(
				\SureCart::svg()->get(
					is_rtl() ? 'arrow-right' : 'arrow-left',
					[
						'class'       => 'wp-block-surecart-product-review-pagination-prev__icon',
						'aria-hidden' => true,
						'width'       => 16,
						'height'      => 16,
					]
				),
				sc_allowed_svg_html()
			);

			$next_arrow = wp_kses(
				\SureCart::svg()->get(
					is_rtl() ? 'arrow-left' : 'arrow-right',
					[
						'class'       => 'wp-block-surecart-product-review-pagination-next__icon',
						'aria-hidden' => true,
						'width'       => 16,
						'height'      => 16,
					]
				),
				sc_allowed_svg_html()
			);

			$content .= '<nav style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 20px;">';
			$content .= '<div style="padding: 10px 16px; background: transparent; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;">' . $prev_arrow . esc_html__( 'Previous', 'surecart' ) . '</div>';
			$content .= '<div style="display: flex; gap: 4px;"><span style="padding: 8px 12px;">1</span><span style="padding: 8px 12px; opacity: 0.5;">2</span><span style="padding: 8px 12px; opacity: 0.5;">3</span></div>';
			$content .= '<div style="padding: 10px 16px; background: transparent; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;">' . esc_html__( 'Next', 'surecart' ) . $next_arrow . '</div>';
			$content .= '</nav>';
		}
		$content .= '</div>';

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$content,
			'',
			'div'
		);
	}
}
