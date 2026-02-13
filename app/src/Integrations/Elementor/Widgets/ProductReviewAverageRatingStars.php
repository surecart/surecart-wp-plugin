<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Stars widget.
 */
class ProductReviewAverageRatingStars extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-product-review-average-rating-stars';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Average Rating Stars', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-rating';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'product', 'rating', 'stars', 'review' );
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
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'section_rating_stars',
			[
				'label' => esc_html__( 'Rating Star Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'link_to_reviews',
			[
				'label'        => esc_html__( 'Link to Reviews', 'surecart' ),
				'type'         => \Elementor\Controls_Manager::SWITCHER,
				'label_on'     => esc_html__( 'Yes', 'surecart' ),
				'label_off'    => esc_html__( 'No', 'surecart' ),
				'return_value' => 'yes',
				'default'      => 'no',
				'description'  => esc_html__( 'Link to the reviews section.', 'surecart' ),
			]
		);

		$this->add_control(
			'size',
			[
				'label'      => esc_html__( 'Star Size', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 10,
						'max' => 100,
					],
				],
				'default'    => [
					'size' => 20,
					'unit' => 'px',
				],
			]
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars svg' => 'fill: {{VALUE}}; stroke: {{VALUE}}; color: {{VALUE}};',
				],
			)
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_layout',
			[
				'label' => esc_html__( 'Spacing', 'surecart' ),
			]
		);

		$this->add_control(
			'display',
			[
				'label'     => esc_html__( 'Display', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::SELECT,
				'options'   => [
					'inline-flex' => esc_html__( 'Inline Flex', 'surecart' ),
					'flex'        => esc_html__( 'Flex', 'surecart' ),
				],
				'default'   => 'flex',
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars' => 'display: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'gap',
			[
				'label'      => esc_html__( 'Gap Between Stars', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default'    => [
					'size' => 2,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars' => 'gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings        = $this->get_settings_for_display();
		$size            = $settings['size']['size'] ?? 20;
		$fill_color      = ! empty( $settings['fill_color'] ) ? $settings['fill_color'] : 'var(--e-global-color-primary)'; // Fallback to CSS variable if no color is selected.
		$link_to_reviews = 'yes' === ( $settings['link_to_reviews'] ?? 'yes' );

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $size );
			return;
		}

		$attributes = [
			'fill_color'      => $fill_color,
			'size'            => absint( $size ) . 'px',
			'link_to_reviews' => $link_to_reviews,
		];
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-average-rating-stars <?php echo wp_json_encode( $attributes ); ?> /-->
		</div>
		<?php
	}

	/**
	 * Render preview in editor.
	 *
	 * @param int $size Star size.
	 *
	 * @return void
	 */
	private function render_preview( $size ) {
		?>
		<div class="wp-block-surecart-product-review-average-rating-stars" style="display: flex; line-height:1;">
			<?php
			for ( $i = 1; $i <= 5; $i++ ) {
				$is_full_star = $i <= 4;
				$is_half_star = 5 === $i;

				echo wp_kses(
					\SureCart::svg()->get(
						$is_half_star ? 'half-star' : 'star',
						[
							'class'        => 'sc-star-row__label__svg',
							'height'       => esc_attr( $size ),
							'width'        => esc_attr( $size ),
							'fill'         => $is_full_star || $is_half_star ? 'currentColor' : 'none',
							'stroke'       => 'currentColor',
							'stroke-width' => 2,
							'aria-hidden'  => 'true',
						]
					),
					sc_allowed_svg_html()
				);
			}
			?>
		</div>
		<?php
	}
}
