<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review List widget.
 */
class ProductReviewList extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-list';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Review List', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-post-list';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'product', 'review', 'list', 'reviews', 'rating' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-elements' );
	}

	/**
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_review_list_header',
			[
				'label' => esc_html__( 'Review Header', 'surecart' ),
			]
		);

		$this->add_control(
			'show_header',
			[
				'label'        => esc_html__( 'Show Header', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show the header with filters and add review button.', 'surecart' ),
			]
		);

		$this->add_control(
			'show_sidebar',
			[
				'label'        => esc_html__( 'Show Filter & Sidebar', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show the filter and sidebar with filter options.', 'surecart' ),
			]
		);

		$this->add_control(
			'show_add_button',
			[
				'label'        => esc_html__( 'Show Add Review Button', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show the add review button in the header.', 'surecart' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_review_button',
			[
				'label' => esc_html__( 'Add Review Button', 'surecart' ),
			]
		);

		$this->add_control(
			'button_text',
			[
				'label'     => esc_html__( 'Button Text', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::TEXT,
				'default'   => esc_html__( 'Write a Review', 'surecart' ),
				'condition' => [
					'show_add_button' => 'yes',
				],
			]
		);

		$this->add_control(
			'button_icon_size',
			[
				'label'       => esc_html__( 'Icon Size', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::NUMBER,
				'default'     => 15,
				'min'         => 10,
				'max'         => 100,
				'step'        => 1,
				'condition'   => [
					'show_add_button' => 'yes',
				],
				'description' => esc_html__( 'Size of the icon in pixels.', 'surecart' ),
				'selectors'   => [
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button .sc-product-review-add-button__icon' => 'width: {{VALUE}}px; height: {{VALUE}}px;',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_review_list_item',
			[
				'label' => esc_html__( 'Review Item', 'surecart' ),
			]
		);

		$this->add_control(
			'show_review_date',
			[
				'label'        => esc_html__( 'Show Review Date', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show the review date.', 'surecart' ),
			]
		);

		$this->add_control(
			'show_content',
			[
				'label'        => esc_html__( 'Show Review Content', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show the review content/description.', 'surecart' ),
			]
		);

		$this->add_control(
			'verified_badge_icon_size',
			[
				'label'       => esc_html__( 'Verified Badge Icon Size', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px' ],
				'range'       => [
					'px' => [
						'min'  => 10,
						'max'  => 50,
						'step' => 1,
					],
				],
				'default'     => [
					'unit' => 'px',
					'size' => 16,
				],
				'description' => esc_html__( 'Size of the verified badge icon in pixels.', 'surecart' ),
				'selectors'   => [
					'{{WRAPPER}} .wp-block-surecart-product-review-verified-badge svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .wp-block-surecart-product-review-verified-badge' => 'gap: 4px;',
					'{{WRAPPER}} .wp-block-surecart-product-review-verified-badge .sc-product-review-verified-badge__icon' => 'display: inline-flex; align-items: center;',
				],
			]
		);

		$this->add_control(
			'verified_badge_icon_color',
			[
				'label'       => esc_html__( 'Verified Badge Icon Color', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::COLOR,
				'description' => esc_html__( 'Color of the verified badge icon.', 'surecart' ),
				'selectors'   => [
					'{{WRAPPER}} .wp-block-surecart-product-review-verified-badge .sc-product-review-verified-badge__icon' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'no_reviews_text',
			[
				'label'       => esc_html__( 'No Reviews Text', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'default'     => esc_html__( 'No reviews yet, write one now?', 'surecart' ),
				'placeholder' => esc_html__( 'Enter text for when no reviews exist', 'surecart' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_review_list_pagination',
			[
				'label' => esc_html__( 'Pagination', 'surecart' ),
			]
		);

		$this->add_control(
			'show_pagination',
			[
				'label'        => esc_html__( 'Show Pagination', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show pagination controls at the bottom.', 'surecart' ),
			]
		);

		$this->add_control(
			'reviews_per_page',
			[
				'label'       => esc_html__( 'Reviews Per Page', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::NUMBER,
				'default'     => 10,
				'min'         => 1,
				'max'         => 100,
				'step'        => 1,
				'description' => esc_html__( 'Number of reviews to display per page.', 'surecart' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	private function register_style_settings() {
		$selector        = '{{WRAPPER}} .wp-block-surecart-product-review-list';
		$review_selector = '{{WRAPPER}} .wp-block-surecart-product-review-list .sc-product-review-link > .wp-block-group';
		$star_selector   = '{{WRAPPER}} .wp-block-surecart-product-review-rating-stars svg';
		$button_selector = '{{WRAPPER}} .wp-block-surecart-product-review-add-button';

		$this->start_controls_section(
			'section_review_list_style',
			array(
				'label' => esc_html__( 'Review Item Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'heading_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					$selector => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => $selector,
			]
		);

		$this->add_control(
			'review_border_type',
			array(
				'label'     => esc_html__( 'Review Border Type', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::SELECT,
				'options'   => [
					''       => esc_html__( 'Default', 'surecart' ),
					'none'   => esc_html__( 'None', 'surecart' ),
					'solid'  => esc_html__( 'Solid', 'surecart' ),
					'double' => esc_html__( 'Double', 'surecart' ),
					'dotted' => esc_html__( 'Dotted', 'surecart' ),
					'dashed' => esc_html__( 'Dashed', 'surecart' ),
					'groove' => esc_html__( 'Groove', 'surecart' ),
				],
				'default'   => 'solid',
				'selectors' => [
					$review_selector => 'border-bottom-style: {{VALUE}} !important;',
				],
			)
		);

		$this->add_control(
			'review_border_width',
			[
				'label'      => esc_html__( 'Review Border Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min'  => 0,
						'max'  => 10,
						'step' => 1,
					],
				],
				'default'    => [
					'unit' => 'px',
					'size' => 1,
				],
				'selectors'  => [
					$review_selector => 'border-bottom-width: {{SIZE}}{{UNIT}} !important;',
				],
			]
		);

		$this->add_control(
			'review_border_color',
			array(
				'label'     => esc_html__( 'Review Border Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '#e5e7eb',
				'selectors' => [
					$review_selector => 'border-bottom-color: {{VALUE}} !important;',
				],
			)
		);

		$this->add_control(
			'spacing',
			[
				'label'      => esc_html__( 'Review Spacing', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
					'em' => [
						'min'  => 0,
						'max'  => 10,
						'step' => 0.1,
					],
				],
				'default'    => [
					'size' => 32,
					'unit' => 'px',
				],
				'selectors'  => [
					$review_selector => 'padding-top: {{SIZE}}{{UNIT}} !important; padding-bottom: {{SIZE}}{{UNIT}} !important;',
				],
			]
		);

		$this->add_control(
			'padding',
			[
				'label'      => esc_html__( 'Container Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'margin',
			[
				'label'      => esc_html__( 'Container Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_review_sidebar',
			array(
				'label' => esc_html__( 'Review Sidebar Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'sidebar_clear_text_color',
			array(
				'label'     => esc_html__( 'Clear All Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$selector . ' .wp-block-surecart-product-review-list-filter-tags-clear-all' => 'color: {{VALUE}};',
				],
			)
		);

		$this->end_controls_section();

		// Star Rating Style.
		$this->start_controls_section(
			'section_star_rating_style',
			array(
				'label' => esc_html__( 'Star Rating Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'fill_color',
			array(
				'label'     => esc_html__( 'Star Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$star_selector => 'stroke: {{VALUE}}; color: {{VALUE}}; fill: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'star_size',
			[
				'label'       => esc_html__( 'Star Size', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => [ 'px' ],
				'range'       => [
					'px' => [
						'min'  => 10,
						'max'  => 50,
						'step' => 1,
					],
				],
				'default'     => [
					'unit' => 'px',
					'size' => 20,
				],
				'description' => esc_html__( 'Size of the star rating in pixels.', 'surecart' ),
				'selectors'   => [
					$star_selector => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		// Add Review Button Style.
		$this->start_controls_section(
			'section_add_button_style',
			array(
				'label'     => esc_html__( 'Add Review Button', 'surecart' ),
				'tab'       => \Elementor\Controls_Manager::TAB_STYLE,
				'condition' => [
					'show_add_button' => 'yes',
				],
			)
		);

		$this->add_control(
			'button_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '#ffffff',
				'selectors' => [
					$button_selector       => 'color: {{VALUE}};',
					"{$button_selector} a" => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'button_background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					$button_selector => 'background-color: {{VALUE}}; hover-background-color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'button_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => "{$button_selector}, {$button_selector} a",
			]
		);

		$this->add_control(
			'button_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					$button_selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'button_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem' ],
				'selectors'  => [
					$button_selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'button_border',
				'selector' => $button_selector,
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Box_Shadow::get_type(),
			[
				'name'     => 'button_box_shadow',
				'selector' => $button_selector,
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->register_content_settings();
		$this->register_style_settings();
	}

	/**
	 * Get the review list block content.
	 *
	 * @param array $settings Widget settings.
	 *
	 * @return string
	 */
	private function get_review_list_content( $settings ) {
		$show_header      = 'yes' === ( $settings['show_header'] ?? 'yes' );
		$show_sidebar     = 'yes' === ( $settings['show_sidebar'] ?? 'yes' );
		$show_add_button  = 'yes' === ( $settings['show_add_button'] ?? 'yes' );
		$show_pagination  = 'yes' === ( $settings['show_pagination'] ?? 'yes' );
		$show_date        = 'yes' === ( $settings['show_review_date'] ?? 'yes' );
		$show_content     = 'yes' === ( $settings['show_content'] ?? 'yes' );
		$no_reviews_text  = $settings['no_reviews_text'] ?? esc_html__( 'No reviews yet, write one now?', 'surecart' );
		$reviews_per_page = ! empty( $settings['reviews_per_page'] ) ? absint( $settings['reviews_per_page'] ) : 10;

		// Build block attributes.
		$block_attrs = [
			'metadata' => [
				'categories'  => [ 'surecart_review_list' ],
				'patternName' => 'surecart-product-review-standard',
				'name'        => 'Default Review List',
			],
			'query'    => [
				'perPage' => $reviews_per_page,
				'pages'   => 0,
				'offset'  => 0,
			],
		];

		// Start Review List Block content.
		$content = '<!-- wp:surecart/product-review-list ' . wp_json_encode( $block_attrs ) . ' -->';

		// Product Reviews wrapper - only shows content when reviews exist.
		$content .= '<!-- wp:surecart/product-reviews -->';

		// Header.
		if ( $show_header ) {
			$content .= '<!-- wp:group {"metadata":{"name":"Header"},"style":{"spacing":{"margin":{"bottom":"10px"},"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
			$content .= '<div class="wp-block-group" style="margin-bottom:10px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">';
			$content .= $show_sidebar ? '<!-- wp:surecart/product-review-list-sidebar-toggle {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->' : '&nbsp;';

			if ( $show_add_button ) {
				$btn_attrs = $this->get_button_attributes( $settings );
				$content  .= '<!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /-->';
			}

			$content .= '</div><!-- /wp:group -->';
		}

		// Content with Sidebar.
		$content .= '<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->';
		$content .= '<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0">';

		// Sidebar.
		if ( $show_sidebar ) {
			$content .= $this->get_sidebar_block_content();
		}

		// Review Template.
		$date_block    = $show_date ? '<!-- wp:surecart/product-review-date {"datetime":"2025-10-02T09:37:00.225Z","format":"human-diff"} /-->' : '';
		$content_block = $show_content ? '<!-- wp:surecart/product-review-content /-->' : '';

		// Pagination block.
		$pagination_block = '';
		if ( $show_pagination ) {
			$pagination_block .= '<!-- wp:surecart/product-review-pagination {"style":{"spacing":{"margin":{"top":"30px","bottom":"30px"}}}} -->';
			$pagination_block .= '<!-- wp:surecart/product-review-pagination-previous /-->';
			$pagination_block .= '<!-- wp:surecart/product-review-pagination-numbers /-->';
			$pagination_block .= '<!-- wp:surecart/product-review-pagination-next /-->';
			$pagination_block .= '<!-- /wp:surecart/product-review-pagination -->';
		}

		$content .= '
			<!-- wp:group {"style":{"spacing":{"blockGap":"0px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->
			<!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"top":"24px","bottom":"24px","right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"constrained","contentSize":"100%"}} -->
			<div class="wp-block-group" style="border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:24px;padding-bottom:24px;padding-right:0px;padding-left:0px"><!-- wp:group {"className":"sc-review-header-group","style":{"spacing":{"margin":{"top":"0","bottom":"16px"},"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
			<div class="wp-block-group sc-review-header-group" style="margin-top:0;margin-bottom:16px;padding-right:0px;padding-left:0px"><!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
			<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px"><!-- wp:surecart/product-review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"right":"8px"}},"typography":{"fontStyle":"normal","fontWeight":"500"}}} /-->
			<!-- wp:surecart/product-review-verified-badge {"label":"Verified Buyer","style":{"typography":{"fontStyle":"normal","fontWeight":"400"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center","orientation":"horizontal"}} /--></div>
			<!-- /wp:group -->' . $date_block . '</div>
			<!-- /wp:group --><!-- wp:surecart/product-review-rating-stars {"style":{"spacing":{"margin":{"bottom":"16px"}}}} /-->
			<!-- wp:surecart/product-review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"bottom":"8px"}}}} /-->' . $content_block . '</div>
			<!-- /wp:group -->
			<!-- /wp:surecart/product-review-template -->' . $pagination_block . '</div>
			<!-- /wp:group --></div>
			<!-- /wp:group -->
		';

		// Close Product Reviews wrapper.
		$content .= '<!-- /wp:surecart/product-reviews -->';

		// No Reviews (outside of product-reviews wrapper).
		$btn_attrs = $this->get_button_attributes( $settings );
		$content  .= '<!-- wp:surecart/product-review-list-no-reviews -->';
		$content  .= '<!-- wp:paragraph {"align":"left","placeholder":"Add text or blocks that will display when a query returns no reviews.","style":{"spacing":{"margin":{"bottom":"16px"}}}} -->';
		$content  .= '<p class="has-text-align-left" style="margin-bottom:16px">' . esc_html( $no_reviews_text ) . '</p><!-- /wp:paragraph -->';
		$content  .= '<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$content  .= '<div class="wp-block-group" style="padding-right:0px;padding-left:0px;margin-top:0;margin-bottom:0"><!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /--></div><!-- /wp:group -->';
		$content  .= '<!-- /wp:surecart/product-review-list-no-reviews -->';

		$content .= '<!-- /wp:surecart/product-review-list -->';

		return $content;
	}

	/**
	 * Get button attributes for add review button.
	 *
	 * @param array $settings Widget settings.
	 *
	 * @return array
	 */
	private function get_button_attributes( $settings ) {
		$btn_label     = $settings['button_text'] ?? esc_html__( 'Write a Review', 'surecart' );
		$btn_icon_size = ! empty( $settings['button_icon_size'] ) ? absint( $settings['button_icon_size'] ) : 15;

		return [
			'width'     => 100,
			'label'     => $btn_label,
			'icon_size' => $btn_icon_size,
		];
	}

	/**
	 * Get sidebar block markup.
	 *
	 * @return string
	 */
	private function get_sidebar_block_content() {
		return '<!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"280px"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"30px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
			<!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->
			<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal"}}} /-->

			<!-- wp:surecart/product-review-list-filter-tags-template {"style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","orientation":"horizontal"}} -->
			<!-- wp:surecart/product-review-list-filter-tag /-->
			<!-- /wp:surecart/product-review-list-filter-tags-template -->

			<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline","fontWeight":"700","fontStyle":"normal"}},"fontSize":"small"} /-->
			<!-- /wp:surecart/product-review-list-filter-tags -->

			<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"8px"}}} -->
			<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"700","fontStyle":"normal"}}} /-->

			<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"6px","margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
			<!-- wp:surecart/product-review-list-filter-checkbox /-->
			<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->
			<!-- /wp:surecart/product-review-list-filter-checkboxes -->
			<!-- /wp:surecart/product-review-list-sidebar -->';
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			?>
			<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<?php $this->render_preview( $settings ); ?>
			</div>
			<?php
			return;
		}
		?>

		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
		<?php echo do_blocks( $this->get_review_list_content( $settings ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
	}

	/**
	 * Get pagination HTML string (reusable for both PHP and JS templates).
	 *
	 * @return void
	 */
	private function get_preview_pagination_html() {
		?>
		<nav class="wp-block-surecart-product-review-pagination" style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 30px; flex-wrap: wrap;">
			<a href="#" style="padding: 10px 16px; background: white; border-radius: 4px; text-decoration: none; color: #374151; display: inline-flex; align-items: center; gap: 6px;">
			<?php
				echo wp_kses(
					\SureCart::svg()->get(
						is_rtl() ? 'arrow-right' : 'arrow-left',
						[
							'class'       => 'wp-block-surecart-product-review-pagination-next__icon',
							'aria-hidden' => true,
						]
					),
					sc_allowed_svg_html()
				)
			?>
				<?php echo esc_html__( 'Previous', 'surecart' ); ?>
			</a>
			<div style="display: flex; gap: 4px;">
				<a href="#" class="sc-page-link" style="display: inline-flex; align-items: center;padding: 0.25em;line-height: 1;gap: var(--sc-spacing-xx-small);text-decoration: none !important;color: inherit;" role="link">1</a>
				<a href="#" style="display: inline-flex; align-items: center;padding: 0.25em;line-height: 1;gap: var(--sc-spacing-xx-small);text-decoration: none !important;color: inherit; opacity: 0.5;" role="link" disabled>2</a>
				<a href="#" style="display: inline-flex; align-items: center;padding: 0.25em;line-height: 1;gap: var(--sc-spacing-xx-small);text-decoration: none !important;color: inherit; opacity: 0.5;" role="link" disabled>3</a>
			</div>
			<a href="#" style="padding: 10px 16px; background: white; border-radius: 4px; text-decoration: none; color: #374151; display: inline-flex; align-items: center; gap: 6px;">
				<?php echo esc_html__( 'Next', 'surecart' ); ?>
				<?php
				echo wp_kses(
					\SureCart::svg()->get(
						is_rtl() ? 'arrow-left' : 'arrow-right',
						[
							'class'       => 'wp-block-surecart-product-review-pagination-next__icon',
							'aria-hidden' => true,
						]
					),
					sc_allowed_svg_html()
				)
				?>
			</a>
		</nav>
			<?php
	}

	/**
	 * Get star rating HTML.
	 *
	 * @return string
	 */
	private function get_star_rating_html() {
		$stars_html = '';
		for ( $s = 1; $s <= 5; $s++ ) {
			$stars_html .= wp_kses(
				\SureCart::svg()->get(
					'star',
					[
						'class' => 'sc-star-row__label__svg',
					]
				),
				sc_allowed_svg_html()
			);
		}
		return $stars_html;
	}

	/**
	 * Get add review button HTML string (reusable for both PHP and JS templates).
	 *
	 * @param array $settings Widget settings.
	 *
	 * @return void
	 */
	private function get_add_button_html( $settings ) {
		$btn_label = $settings['button_text'] ?? __( 'Write a Review', 'surecart' );
		?>
		<div class="wp-block-buttons">
			<div class="wp-block-button">
				<div class="wp-block-button__link sc-button__link wp-block-surecart-product-review-add-button" style="border-radius: 50px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
			<?php
			echo wp_kses(
				\SureCart::svg()->get(
					'edit-2',
					[
						'aria-label' => __( 'Add Review', 'surecart' ),
						'class'      => 'sc-product-review-add-button__icon',
					],
				),
				sc_allowed_svg_html()
			);
			?>
					<span><?php echo esc_html( $btn_label ); ?></span>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Get sidebar HTML string (reusable for both PHP and JS templates).
	 *
	 * @return string
	 */
	private function get_preview_sidebar_html() {
		$filter_options = [
			[
				'stars' => 5,
				'count' => 12,
			],
			[
				'stars' => 4,
				'count' => 10,
			],
			[
				'stars' => 3,
				'count' => 5,
			],
			[
				'stars' => 2,
				'count' => 1,
			],
			[
				'stars' => 1,
				'count' => 2,
			],
		];

		$filters_html = '';
		foreach ( $filter_options as $option ) {
			$filters_html .= '
				<label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
					<input type="checkbox" style="width: 16px; height: 16px; cursor: pointer;"/>
					<span style="display: flex; align-items: center; gap: 4px;">
						<span>' . esc_html( $option['stars'] . ' Stars (' . $option['count'] . ')' ) . '</span>
					</span>
				</label>';
		}

			return '<div class="wp-block-surecart-product-review-list-sidebar" style="width: 250px; min-width: 250px;">
				<div style="margin-bottom: 30px;">
					<div style="font-weight: 600; margin-bottom: 10px;">' . esc_html__( 'Applied Filters', 'surecart' ) . '</div>
					<div style="display: flex; gap: 8px; flex-wrap: wrap;">
						<span style="padding: 6px 12px; background: #f3f4f6; border-radius: 16px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;">
							5 Stars
							' . wp_kses(
						\SureCart::svg()->get(
							'x',
							[
								'class'      => 'sc-tag__clear',
								'aria-label' => __( 'Remove tag', 'surecart' ),
							],
						),
						sc_allowed_svg_html()
					) . '
						</span>
					</div>
					<div class="wp-block-surecart-product-review-list-filter-tags-clear-all" style="margin-top: 10px; text-decoration: underline; font-size: 14px; cursor: pointer;">' . esc_html__( 'Clear All', 'surecart' ) . '</div>
				</div>
				<div>
					<div style="font-weight: 600; margin-bottom: 12px;">' . esc_html__( 'Filter by', 'surecart' ) . '</div>
					<div style="display: flex; flex-direction: column; gap: 10px;">'
						. $filters_html . '
					</div>
				</div>
			</div>';
	}

	/**
	 * Get single review item HTML string (reusable for both PHP and JS templates).
	 *
	 * @param bool $show_date     Whether to show review date.
	 * @param bool $show_content  Whether to show review content.
	 *
	 * @return string
	 */
	private function get_preview_review_item_html( $show_date, $show_content ) {
		$verified_badge = '
			<span style="display: inline-flex; align-items: center; gap: 4px;" class="wp-block-surecart-product-review-verified-badge">
				' . esc_html__( 'Verified Buyer', 'surecart' ) . '
				<span class="sc-product-review-verified-badge__icon" style="display: inline-flex; align-items: center;">' . wp_kses(
					\SureCart::svg()->get( 'verified' ),
					sc_allowed_svg_html()
				) . '</span>
			</span>';

		$date_html = $show_date ? '<span style="color: #6b7280; font-size: 14px;">' . esc_html__( '2 days ago', 'surecart' ) . '</span>' : '';

		$content_html = $show_content ? '<p style="color: #4b5563; margin: 0; line-height: 1.6;">' . esc_html__( 'This is an excellent product. I highly recommend it to anyone looking for quality and reliability.', 'surecart' ) . '</p>' : '';

		return '
			<div class="sc-product-review-link">
				<div class="wp-block-group">
					<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
						<div style="display: flex; gap: 10px; align-items: center;">
							<span style="font-weight: 500;">' . esc_html__( 'John Doe', 'surecart' ) . '</span>'
						. $verified_badge . '
						</div>'
					. $date_html . '
					</div>
					<div class="wp-block-surecart-product-review-rating-stars" style="display: inline-flex; gap: 2px; margin-bottom: 8px;">'
					. $this->get_star_rating_html() . '
					</div>
					<div style="font-weight: 700; margin-bottom: 8px; font-size: 16px;">' . esc_html__( 'Great Product!', 'surecart' ) . '</div>'
					. $content_html . '
				</div>
			</div>';
	}

	/**
	 * Get header HTML for preview.
	 *
	 * @param bool  $show_sidebar    Whether to show sidebar toggle.
	 * @param bool  $show_add_button Whether to show add review button.
	 * @param array $settings        Widget settings.
	 *
	 * @return string
	 */
	private function get_preview_header_html( $show_sidebar, $show_add_button, $settings ) {
		ob_start();
		?>
		<div style="display: flex; justify-content: space-between; align-items: center;">
			<div style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
				<?php if ( $show_sidebar ) : ?>
					<?php
					echo wp_kses(
						\SureCart::svg()->get(
							'sliders',
							[
								'aria-label' => __( 'Open sidebar', 'surecart' ),
								'width'      => 16,
								'height'     => 16,
								'class'      => 'sc-sidebar-toggle__icon',
							],
						),
						sc_allowed_svg_html()
					);
					?>
					<span><?php echo esc_html__( 'Filters', 'surecart' ); ?></span>
				<?php endif; ?>
			</div>
			<?php if ( $show_add_button ) : ?>
				<?php $this->get_add_button_html( $settings ); ?>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render preview in editor.
	 *
	 * @param array $settings Widget settings.
	 *
	 * @return void
	 */
	private function render_preview( $settings ) {
		$show_header     = 'yes' === ( $settings['show_header'] ?? 'yes' );
		$show_sidebar    = 'yes' === ( $settings['show_sidebar'] ?? 'yes' );
		$show_add_button = 'yes' === ( $settings['show_add_button'] ?? 'yes' );
		$show_pagination = 'yes' === ( $settings['show_pagination'] ?? 'yes' );
		$show_date       = 'yes' === ( $settings['show_review_date'] ?? 'yes' );
		$show_content    = 'yes' === ( $settings['show_content'] ?? 'yes' );
		?>
		<div class="wp-block-surecart-product-review-list">
			<?php if ( $show_header ) : ?>
				<?php echo $this->get_preview_header_html( $show_sidebar, $show_add_button, $settings ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php endif; ?>

			<div style="display: flex; gap: 30px; margin-top: 30px; margin-bottom: 30px;">
				<?php if ( $show_sidebar ) : ?>
					<?php echo $this->get_preview_sidebar_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>

				<div style="flex: 1;">
					<?php for ( $i = 0; $i < 3; $i++ ) : ?>
						<?php echo $this->get_preview_review_item_html( $show_date, $show_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php endfor; ?>
				</div>
			</div>
		</div>
		<?php if ( $show_pagination ) : ?>
			<?php $this->get_preview_pagination_html(); ?>
		<?php endif; ?>
		<?php
	}
}
