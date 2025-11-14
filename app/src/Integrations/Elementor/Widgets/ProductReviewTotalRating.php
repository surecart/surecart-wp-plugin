<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Total Rating widget.
 */
class ProductReviewTotalRating extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-total-rating';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Total Rating', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-number-field';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'product', 'total', 'rating', 'review', 'count' );
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
			'section_total_rating',
			[
				'label' => esc_html__( 'Total Rating', 'surecart' ),
			]
		);

		$this->add_control(
			'show_for_zero_reviews',
			[
				'label'        => esc_html__( 'Show For Zero Reviews', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Display the block even when there are zero reviews.', 'surecart' ),
			]
		);

		$this->add_control(
			'show_label',
			[
				'label'        => esc_html__( 'Show Label', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Show', 'surecart' ),
				'label_off'    => esc_html__( 'Hide', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => esc_html__( 'Show "review" or "reviews" label after the count.', 'surecart' ),
			]
		);

		$this->add_control(
			'style_variant',
			[
				'label'   => esc_html__( 'Style', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'default'   => esc_html__( 'Default', 'surecart' ),
					'plus-sign' => esc_html__( 'Plus Sign', 'surecart' ),
				],
				'default' => 'default',
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
			'section_total_rating_style',
			array(
				'label' => esc_html__( 'Total Rating Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-total-rating' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'count_color',
			array(
				'label'     => esc_html__( 'Count Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sc-total-reviews-count' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'label'    => esc_html__( 'Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-total-rating',
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'count_typography',
				'label'    => esc_html__( 'Count Typography', 'surecart' ),
				'selector' => '{{WRAPPER}} .sc-total-reviews-count',
			]
		);

		$this->add_responsive_control(
			'text_align',
			[
				'label'     => esc_html__( 'Alignment', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::CHOOSE,
				'options'   => [
					'left'   => [
						'title' => esc_html__( 'Left', 'surecart' ),
						'icon'  => 'eicon-text-align-left',
					],
					'center' => [
						'title' => esc_html__( 'Center', 'surecart' ),
						'icon'  => 'eicon-text-align-center',
					],
					'right'  => [
						'title' => esc_html__( 'Right', 'surecart' ),
						'icon'  => 'eicon-text-align-right',
					],
				],
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-total-rating' => 'justify-content: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'gap',
			[
				'label'      => esc_html__( 'Gap', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
					'em' => [
						'min'  => 0,
						'max'  => 5,
						'step' => 0.1,
					],
				],
				'default'    => [
					'size' => 4,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-total-rating' => 'gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'padding',
			[
				'label'      => esc_html__( 'Padding', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-total-rating' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'margin',
			[
				'label'      => esc_html__( 'Margin', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-total-rating' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
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
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings              = $this->get_settings_for_display();
		$show_label            = 'yes' === ( $settings['show_label'] ?? 'yes' );
		$show_for_zero_reviews = 'yes' === ( $settings['show_for_zero_reviews'] ?? 'yes' );
		$style_variant         = $settings['style_variant'] ?? 'default';

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $show_label );
			return;
		}

		$attributes = [
			'show_label'            => $show_label,
			'show_for_zero_reviews' => $show_for_zero_reviews,
			'style_variant'         => $style_variant,
		];
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-total-rating <?php echo wp_json_encode( $attributes ); ?> /-->
		</div>
		<?php
	}

	/**
	 * Render preview in editor.
	 *
	 * @param bool $show_label Show label flag.
	 *
	 * @return void
	 */
	private function render_preview( $show_label ) {
		$settings  = $this->get_settings_for_display();
		$is_plus   = 'plus-sign' === ( $settings['style_variant'] ?? 'default' );
		$plus_sign = $is_plus ? '+' : '';
		?>
		<div class="wp-block-surecart-product-review-total-rating" style="display: flex; gap: 4px;">
			<span class="sc-total-reviews-count">42<?php echo esc_html( $plus_sign ); ?></span>
			<?php if ( $show_label ) : ?>
				<?php echo esc_html__( 'reviews', 'surecart' ); ?>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<#
		var showLabel = settings.show_label === 'yes';
		var styleVariant = settings.style_variant || 'default';
		var className = 'default' === styleVariant ? '' : ' is-style-' + styleVariant;
		var plusSign = 'plus-sign' === styleVariant ? '+' : '';
		#>
		<div class="wp-block-surecart-product-review-total-rating{{ className }}" style="display: flex; gap: 4px;">
			<span class="sc-total-reviews-count">42{{{ plusSign }}}</span>
			<# if ( showLabel ) { #>
				<?php echo esc_html__( 'reviews', 'surecart' ); ?>
			<# } #>
		</div>
		<?php
	}
}
