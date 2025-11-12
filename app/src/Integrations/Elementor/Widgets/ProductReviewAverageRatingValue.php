<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Value widget.
 */
class ProductReviewAverageRatingValue extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-average-rating-value';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Average Rating Value', 'surecart' );
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
		return array( 'surecart', 'product', 'rating', 'value', 'review', 'number' );
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
			'section_rating_value',
			[
				'label' => esc_html__( 'Rating Value', 'surecart' ),
			]
		);

		$this->add_control(
			'format_style',
			[
				'label'   => esc_html__( 'Format Style', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'none'        => esc_html__( 'None', 'surecart' ),
					'parentheses' => esc_html__( 'Parentheses', 'surecart' ),
					'slash'       => esc_html__( '/ 5', 'surecart' ),
				],
				'default' => 'none',
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
			'section_rating_value_style',
			array(
				'label' => esc_html__( 'Value Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'text_color',
			array(
				'label'     => esc_html__( 'Text Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value' => 'color: {{VALUE}};',
				],
			)
		);

		$this->add_control(
			'background_color',
			array(
				'label'     => esc_html__( 'Background Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value' => 'background-color: {{VALUE}};',
				],
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name'     => 'typography',
				'selector' => '{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value' => 'text-align: {{VALUE}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Border::get_type(),
			[
				'name'      => 'border',
				'selector'  => '{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value',
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em', 'rem' ],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-value' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$settings     = $this->get_settings_for_display();
		$format_style = $settings['format_style'] ?? 'none';
		$class_name   = 'none' === $format_style ? '' : ' is-style-' . $format_style;

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			?>
			<span class="wp-block-surecart-product-review-average-rating-value<?php echo esc_attr( $class_name ); ?>">
				<?php
				if ( 'parentheses' === $format_style ) {
					echo '(4.3)';
				} elseif ( 'slash' === $format_style ) {
					echo '4.3 / 5.0';
				} else {
					echo '4.3';
				}
				?>
			</span>
			<?php
			return;
		}
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-average-rating-value {"className":"<?php echo esc_attr( trim( $class_name ) ); ?>"} /-->
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
		var formatStyle = settings.format_style || 'none';
		var className = 'none' === formatStyle ? '' : ' is-style-' + formatStyle;
		var displayValue = '4.3';
		
		if ( 'parentheses' === formatStyle ) {
			displayValue = '(4.3)';
		} else if ( 'slash' === formatStyle ) {
			displayValue = '4.3 / 5';
		}
		#>
		<span class="wp-block-surecart-product-review-average-rating-value{{ className }}" style="display: inline-block;">
			{{{ displayValue }}}
		</span>
		<?php
	}
}
