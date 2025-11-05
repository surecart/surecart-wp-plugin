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
				'label' => esc_html__( 'Header', 'surecart' ),
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

		$this->end_controls_section();

		$this->start_controls_section(
			'section_review_list_content',
			[
				'label' => esc_html__( 'Content', 'surecart' ),
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

		$this->end_controls_section();
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	private function register_style_settings() {
		$this->start_controls_section(
			'section_review_list_style',
			array(
				'label' => esc_html__( 'Review List Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'heading_text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-list' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-list',
			]
		);

		$this->add_control(
			'review_border_color',
			array(
				'label'     => esc_html__( 'Review Border Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'default'   => '#e5e7eb',
				'selectors' => [
					'{{WRAPPER}} .wp-block-group' => 'border-bottom-color: {{VALUE}};',
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
					'size' => 0,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-group' => 'padding-top: {{SIZE}}{{UNIT}}; padding-bottom: {{SIZE}}{{UNIT}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-list' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-list' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
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
			'star_color',
			array(
				'label'     => esc_html__( 'Star Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-rating-stars svg' => 'stroke: {{VALUE}};',
				],
			)
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
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button' => 'color: {{VALUE}};',
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button a' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button' => 'background-color: {{VALUE}}; hover-background-color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'button_hover_text_color',
			array(
				'label'     => esc_html__( 'Hover Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button:hover' => 'color: {{VALUE}};',
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button:hover a' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'button_hover_background_color',
			array(
				'label'     => esc_html__( 'Hover Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button:hover' => 'background-color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'button_typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-add-button, {{WRAPPER}} .wp-block-surecart-product-review-add-button a',
			]
		);

		$this->add_control(
			'button_padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-add-button' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'     => 'button_border',
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-add-button',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Box_Shadow::get_type(),
			[
				'name'     => 'button_box_shadow',
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-add-button',
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
		$show_header     = 'yes' === ( $settings['show_header'] ?? 'yes' );
		$show_sidebar    = 'yes' === ( $settings['show_sidebar'] ?? 'yes' );
		$show_add_button = 'yes' === ( $settings['show_add_button'] ?? 'yes' );
		$show_pagination = 'yes' === ( $settings['show_pagination'] ?? 'yes' );
		$show_date       = 'yes' === ( $settings['show_review_date'] ?? 'yes' );
		$show_content    = 'yes' === ( $settings['show_content'] ?? 'yes' );
		$no_reviews_text = $settings['no_reviews_text'] ?? esc_html__( 'No reviews yet, write one now?', 'surecart' );

		$fill_color = 'var(--e-global-color-primary)'; // fallback for block.
		$product    = sc_get_product();
		if ( empty( $product ) || empty( $product->total_reviews ) ) {
			$fill_color = 'none';
		}

		$content = '<!-- wp:surecart/product-review-list {"metadata":{"categories":["surecart_review_list"],"patternName":"surecart-product-review-standard","name":"Default Review List"}} -->';

		// Header.
		if ( $show_header ) {
			$content .= '<!-- wp:surecart/product-review-list-content-header {"style":{"border":{"bottom":{"color":"#eeeeee","width":"1px"}},"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","orientation":"horizontal","verticalAlignment":"top","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
			$content .= $show_sidebar ? '<!-- wp:surecart/product-review-list-sidebar-toggle {"label":"Filters","style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->' : '&nbsp;';

			if ( $show_add_button ) {
				// build add button attributes from settings.
				$btn_label      = $settings['button_text'] ?? esc_html__( 'Write a Review', 'surecart' );
				$btn_text_color = $settings['button_text_color'] ?? null;
				$btn_bg_color   = $settings['button_background_color'] ?? null;

				$btn_attrs = [
					'width'     => 100,
					'className' => 'is-style-fill',
					'label'     => $btn_label,
				];

				$style = [ 'spacing' => [ 'blockGap' => 'var:preset|spacing|30' ] ];
				if ( $btn_text_color || $btn_bg_color ) {
					$style['color'] = [];
					if ( $btn_text_color ) {
						$style['color']['text'] = $btn_text_color;
					}
					if ( $btn_bg_color ) {
						$style['color']['background'] = $btn_bg_color;
					}
				} else {
					$style                        = [
						'elements' => [ 'link' => [ 'color' => [ 'text' => 'var:preset|color|white' ] ] ],
						'spacing'  => [ 'blockGap' => 'var:preset|spacing|30' ],
					];
					$btn_attrs['backgroundColor'] = 'surecart';
					$btn_attrs['textColor']       = 'white';
				}

				$btn_attrs['style'] = $style;

				$content .= '<!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /--></div><!-- /wp:group -->';
			}

			$content .= '<!-- /wp:surecart/product-review-list-content-header -->';
		}

		// Content with Sidebar.
		$content .= '<!-- wp:surecart/product-review-list-content {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}}} -->';

		// Sidebar.
		if ( $show_sidebar ) {
			$content .= '
				<!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"300px","type":"flex","orientation":"vertical"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","orientation":"vertical"}} -->
				<div class="wp-block-surecart-product-review-list-sidebar"><!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->
				<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->

				<!-- wp:surecart/product-review-list-filter-tags-template {"layout":{"type":"flex","orientation":"horizontal"}} -->
				<!-- wp:surecart/product-review-list-filter-tag /-->
				<!-- /wp:surecart/product-review-list-filter-tags-template -->

				<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline"}}} /-->
				<!-- /wp:surecart/product-review-list-filter-tags -->

				<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->
				<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->

				<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
				<!-- wp:surecart/product-review-list-filter-checkbox /-->
				<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->
				<!-- /wp:surecart/product-review-list-filter-checkboxes --></div>
				<!-- /wp:surecart/product-review-list-sidebar -->';
		}

		// Review Template.
		$date_block    = $show_date ? '<!-- wp:surecart/product-review-date {"format":"human-diff"} /-->' : '';
		$content_block = $show_content ? '<!-- wp:surecart/product-review-content /-->' : '';

		$content .= '
			<!-- wp:group {"style":{"spacing":{"blockGap":"0px"},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group"><!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->
			<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20","margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"constrained"}} -->
			<div class="wp-block-group" style="border-bottom-color:#e5e7eb;border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
			<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
			<div class="wp-block-group"><!-- wp:surecart/product-review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"},{"blockGap":"var:preset|spacing|20"}},"typography":{"fontStyle":"normal","fontWeight":"500"}}} /-->
			<!-- wp:surecart/product-review-verified-badge {"icon_size":16,"style":{"typography":{"fontStyle":"normal","fontWeight":"400"},"spacing":{"blockGap":"var:preset|spacing|30"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center","orientation":"horizontal"}} /--></div>
			<!-- /wp:group -->' . $date_block . '</div>
			<!-- /wp:group -->
			<!-- wp:surecart/product-review-rating-stars {"fill_color": "' . esc_attr( $fill_color ) . '"}  /-->
			<!-- wp:surecart/product-review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->' .
			$content_block . '</div>
			<!-- /wp:group -->
			<!-- /wp:surecart/product-review-template --></div>
			<!-- /wp:group -->
			<!-- /wp:surecart/product-review-list-content -->
		';

		// build no-reviews add button attributes.
		$btn_label      = $settings['button_text'] ?? esc_html__( 'Write a Review', 'surecart' );
		$btn_text_color = $settings['button_text_color'] ?? null;
		$btn_bg_color   = $settings['button_background_color'] ?? null;

		$btn_attrs = [
			'width'     => 100,
			'className' => 'is-style-fill',
			'label'     => $btn_label,
		];

		$style = [ 'spacing' => [ 'blockGap' => 'var:preset|spacing|30' ] ];
		if ( $btn_text_color || $btn_bg_color ) {
			$style['color'] = [];
			if ( $btn_text_color ) {
				$style['color']['text'] = $btn_text_color;
			}
			if ( $btn_bg_color ) {
				$style['color']['background'] = $btn_bg_color;
			}
		} else {
			$style                        = [
				'elements' => [ 'link' => [ 'color' => [ 'text' => 'var:preset|color|white' ] ] ],
				'spacing'  => [ 'blockGap' => 'var:preset|spacing|30' ],
			];
			$btn_attrs['backgroundColor'] = 'surecart';
			$btn_attrs['textColor']       = 'white';
		}

		$btn_attrs['style'] = $style;

		// No Reviews.
		$content .= '<!-- wp:surecart/product-review-list-no-reviews --><!-- wp:paragraph {"align":"left","placeholder":"Add text or blocks that will display when a query returns no reviews."} --><p class="has-text-align-left">' . esc_html( $no_reviews_text ) . '</p><!-- /wp:paragraph --><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} --><div class="wp-block-group"><!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /--></div><!-- /wp:group --><!-- /wp:surecart/product-review-list-no-reviews -->';

		// Pagination.
		if ( $show_pagination ) {
			$content .= '
				<!-- wp:surecart/product-review-pagination -->
				<!-- wp:surecart/product-review-pagination-previous /-->
				<!-- wp:surecart/product-review-pagination-numbers /-->
				<!-- wp:surecart/product-review-pagination-next /-->
				<!-- /wp:surecart/product-review-pagination -->';
		}

		$content .= '<!-- /wp:surecart/product-review-list -->';

		return $content;
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
				<?php $this->render_preview(); ?>
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
	private function get_pagination_html() {
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
	 * Get add review button HTML string (reusable for both PHP and JS templates).
	 *
	 * @param array $settings Widget settings.
	 *
	 * @return void
	 */
	private function get_add_button_html( $settings ) {
		$btn_label      = $settings['button_text'] ?? __( 'Write a Review', 'surecart' );
		$btn_text_color = $settings['button_text_color'] ?? null;
		$btn_bg_color   = $settings['button_background_color'] ?? 'var(--e-global-color-primary, #6c63ff)';
		?>
		<div class="wp-block-buttons">
			<div class="wp-block-button">
				<div class="wp-block-button__link sc-button__link wp-block-surecart-product-review-add-button" style="background-color: <?php echo esc_attr( $btn_bg_color ); ?>; color: <?php echo esc_attr( $btn_text_color ); ?>; padding: 15px 30px; border-radius: 50px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
				<?php
				echo wp_kses(
					\SureCart::svg()->get(
						'edit-2',
						[
							'aria-label' => __( 'Add Review', 'surecart' ),
							'class'      => 'sc-product-review-add-button__icon',
							'width'      => 16,
							'height'     => 16,
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
	private function get_sidebar_html() {
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
					<div style="font-weight: 600; margin-bottom: 10px;">' . esc_html__( 'Active Filters', 'surecart' ) . '</div>
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
					<div style="margin-top: 10px; text-decoration: underline; font-size: 14px; cursor: pointer; color: #6c63ff;">' . esc_html__( 'Clear All', 'surecart' ) . '</div>
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
	private function get_review_item_html( $show_date, $show_content = true ) {
		$verified_badge = '
			<span style="display: inline-flex; align-items: center; gap: 4px;">
				' . esc_html__( 'Verified Buyer', 'surecart' ) . '
				' . wp_kses(
					\SureCart::svg()->get(
						'verified',
						[
							'width'  => esc_attr( 20 ),
							'height' => esc_attr( 20 ),
						]
					),
					sc_allowed_svg_html()
				) . '
			</span>';

		$date_html = $show_date ? '<span style="color: #6b7280; font-size: 14px;">' . esc_html__( '2 days ago', 'surecart' ) . '</span>' : '';

		$stars_html = '';
		for ( $s = 1; $s <= 5; $s++ ) {
			$is_full     = $s <= 5;
			$fill        = $is_full ? 'var(--e-global-color-primary)' : 'none';
			$stars_html .= '
				<svg height="18" width="18" viewBox="0 0 24 24" fill="' . $fill . '" stroke="currentColor" stroke-width="2">
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
				</svg>';
		}

		$content_html = $show_content ? '<p style="color: #4b5563; margin: 0; line-height: 1.6;">' . esc_html__( 'This is an excellent product. I highly recommend it to anyone looking for quality and reliability.', 'surecart' ) . '</p>' : '';

		return '
			<div class="wp-block-group" style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
				<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
					<div style="display: flex; gap: 10px; align-items: center;">
						<span style="font-weight: 500;">' . esc_html__( 'John Doe', 'surecart' ) . '</span>'
					. $verified_badge . '
					</div>'
				. $date_html . '
				</div>
				<div class="wp-block-surecart-product-review-rating-stars" style="display: inline-flex; gap: 2px; margin-bottom: 8px;">'
				. $stars_html . '
				</div>
				<div style="font-weight: 700; margin-bottom: 8px; font-size: 16px;">' . esc_html__( 'Great Product!', 'surecart' ) . '</div>'
				. $content_html . '
			</div>';
	}

	/**
	 * Render preview in editor.
	 *
	 * @return void
	 */
	private function render_preview() {
		$settings        = $this->get_settings_for_display();
		$show_header     = 'yes' === ( $settings['show_header'] ?? 'yes' );
		$show_sidebar    = 'yes' === ( $settings['show_sidebar'] ?? 'yes' );
		$show_add_button = 'yes' === ( $settings['show_add_button'] ?? 'yes' );
		$show_pagination = 'yes' === ( $settings['show_pagination'] ?? 'yes' );
		$show_date       = 'yes' === ( $settings['show_review_date'] ?? 'yes' );
		$show_content    = 'yes' === ( $settings['show_content'] ?? 'yes' );
		?>
			<div class="wp-block-surecart-product-review-list">
				<?php if ( $show_header ) : ?>
					<div style="border-bottom: 1px solid #eeeeee; padding: 20px 0; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
							<div style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
								<?php if ( $show_sidebar ) : ?>
									<?php
									echo wp_kses(
										\SureCart::svg()->get(
											'sliders',
											[
												'aria-label' => __( 'Open sidebar', 'surecart' ),
												'width'  => 16,
												'height' => 16,
												'class'  => 'sc-sidebar-toggle__icon',
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
				<?php endif; ?>

				<div style="display: flex; gap: 30px; margin-top: 30px; margin-bottom: 30px;">
					<?php if ( $show_sidebar ) : ?>
						<?php echo $this->get_sidebar_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php endif; ?>

					<div style="flex: 1;">
						<?php for ( $i = 0; $i < 3; $i++ ) : ?>
							<?php echo $this->get_review_item_html( $show_date, $show_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<?php endfor; ?>
					</div>
				</div>
			</div>
			<?php if ( $show_pagination ) : ?>
				<?php $this->get_pagination_html(); ?>
			<?php endif; ?>
		<?php
	}

	/**
	 * Get review item for JS template (with Underscore.js conditionals).
	 *
	 * @return string
	 */
	private function get_review_item_js_template() {
		return '
		<div class="wp-block-group" style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
			<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
				<div style="display: flex; gap: 10px; align-items: center;">
					<span style="font-weight: 500;">' . esc_html__( 'John Doe', 'surecart' ) . '</span>
					<span style="display: inline-flex; align-items: center; gap: 4px;">
						' . esc_html__( 'Verified Buyer', 'surecart' ) . '
						' . wp_kses(
							\SureCart::svg()->get(
								'verified',
								[
									'width'  => esc_attr( 20 ),
									'height' => esc_attr( 20 ),
								]
							),
							sc_allowed_svg_html()
						) . '
					</span>
				</div>
				<# if ( settings.show_review_date === "yes" ) { #>
				<span style="color: #6b7280; font-size: 14px;">' . esc_html__( '2 days ago', 'surecart' ) . '</span>
				<# } #>
			</div>
			<div class="wp-block-surecart-product-review-rating-stars" style="display: inline-flex; gap: 2px; margin-bottom: 8px;">
				<# for ( var s = 1; s <= 5; s++ ) {
					var isFull = s <= 5;
					var fill = isFull ? "var(--e-global-color-primary)" : "none";
				#>
					<svg height="18" width="18" viewBox="0 0 24 24" fill="{{ fill }}" stroke="currentColor" stroke-width="2">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
				<# } #>
			</div>
			<div style="font-weight: 700; margin-bottom: 8px; font-size: 16px;">' . esc_html__( 'Great Product!', 'surecart' ) . '</div>
			<# if ( settings.show_content === "yes" ) { #>
			<p style="color: #4b5563; margin: 0; line-height: 1.6;">' . esc_html__( 'This is an excellent product. I highly recommend it to anyone looking for quality and reliability.', 'surecart' ) . '</p>
			<# } #>
		</div>';
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="wp-block-surecart-product-review-list">
			<# if ( settings.show_header === 'yes' ) { #>
			<div style="border-bottom: 1px solid #eeeeee; padding: 20px 0; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
				<div style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
					<# if ( settings.show_sidebar === 'yes' ) { #>
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
					<# } #>
				</div>

				<# if ( settings.show_add_button === 'yes' ) { #>
					<?php $this->get_add_button_html( [] ); ?>
				<# } #>
			</div>
			<# } #>

			<div style="display: flex; gap: 30px; margin-top: 30px; margin-bottom: 30px;">
				<# if ( settings.show_sidebar === 'yes' ) { #>
					<?php echo $this->get_sidebar_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<# } #>

				<div style="flex: 1;">
					<# for ( var i = 0; i < 3; i++ ) { #>
						<?php echo $this->get_review_item_js_template(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<# } #>
				</div>
			</div>

			<# if ( settings.show_pagination === 'yes' ) { #>
				<?php $this->get_pagination_html(); ?>
			<# } #>
		</div>
		<?php
	}
}
