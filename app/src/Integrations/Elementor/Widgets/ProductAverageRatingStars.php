<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Average Rating Stars widget.
 */
class ProductAverageRatingStars extends \Elementor\Widget_Base {
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
	 * Register the widget content settings.
	 *
	 * @return void
	 */
	private function register_content_settings() {
		$this->start_controls_section(
			'section_rating_stars',
			[
				'label' => esc_html__( 'Rating Stars', 'surecart' ),
			]
		);

		$this->add_control(
			'size',
			[
				'label'      => esc_html__( 'Size', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [
					'px' => [
						'min' => 10,
						'max' => 100,
					],
				],
				'default'    => [
					'size' => 25,
					'unit' => 'px',
				],
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
			'section_rating_stars_style',
			array(
				'label' => esc_html__( 'Stars Style', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'fill_color',
			array(
				'label'     => esc_html__( 'Fill Color', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'global'    => [
					'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
				],
				'selectors' => [
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars svg' => 'stroke: {{VALUE}}; color: {{VALUE}}; fill: {{VALUE}};',
				],
			)
		);

		$this->add_responsive_control(
			'alignment',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars' => 'text-align: {{VALUE}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} .wp-block-surecart-product-review-average-rating-stars' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
		$settings   = $this->get_settings_for_display();
		$size       = $settings['size']['size'] ?? 25;
		$fill_color = 'var(--e-global-color-primary)'; // fallback for block.

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_preview( $size );
			return;
		}

		$product = sc_get_product();
		if ( empty( $product ) || empty( $product->total_reviews ) ) {
			$fill_color = 'none';
		}
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-review-average-rating-stars {"fill_color": "<?php echo esc_attr( $fill_color ); ?>","size":<?php echo absint( $size ); ?>} /-->
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
		<div class="wp-block-surecart-product-review-average-rating-stars" style="display: inline-flex; gap: 2px;">
			<?php
			for ( $i = 1; $i <= 5; $i++ ) {
				$is_full = $i <= 4;
				$is_half = 5 === $i;
				?>
				<svg height="<?php echo esc_attr( $size ); ?>" width="<?php echo esc_attr( $size ); ?>" viewBox="0 0 24 24" fill="<?php echo $is_full ? 'currentColor' : 'none'; ?>" stroke="currentColor" stroke-width="2">
					<?php if ( $is_half ) : ?>
						<defs>
							<linearGradient id="half-fill-<?php echo esc_attr( $i ); ?>">
								<stop offset="50%" stop-color="currentColor"/>
								<stop offset="50%" stop-color="transparent"/>
							</linearGradient>
						</defs>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-fill-<?php echo esc_attr( $i ); ?>)" stroke="currentColor"/>
					<?php else : ?>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					<?php endif; ?>
				</svg>
				<?php
			}
			?>
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
		var size = settings.size.size || 25;
		#>
		<div class="wp-block-surecart-product-review-average-rating-stars" style="display: inline-flex; gap: 2px;">
			<# for ( var i = 1; i <= 5; i++ ) {
				var isFull = i <= 4;
				var isHalf = i === 5;
				var fill = isFull ? 'currentColor' : 'none';
			#>
				<svg height="{{ size }}" width="{{ size }}" viewBox="0 0 24 24" fill="{{ fill }}" stroke="currentColor" stroke-width="2">
					<# if ( isHalf ) { #>
						<defs>
							<linearGradient id="half-fill-{{ i }}">
								<stop offset="50%" stop-color="currentColor"/>
								<stop offset="50%" stop-color="transparent"/>
							</linearGradient>
						</defs>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-fill-{{ i }})" stroke="currentColor"/>
					<# } else { #>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					<# } #>
				</svg>
			<# } #>
		</div>
		<?php
	}
}
