<?php

namespace SureCart\Integrations\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


/**
 * Media widget.
 */
class Media extends \Elementor\Widget_Base {
	/**
	 * Get widget name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'surecart-media';
	}

	/**
	 * Get widget title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Product Media', 'surecart' );
	}

	/**
	 * Get widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-product-images';
	}

	/**
	 * Get the widget keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'surecart', 'media', 'image' );
	}

	/**
	 * Get the widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'surecart-elementor-product' );
	}

	/**
	 * Get style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'surecart-image-slider', 'surecart-product-media' );
	}

	/**
	 * Register the content settings.
	 *
	 * @return void
	 */
	protected function register_content_settings() {
		$this->start_controls_section(
			'section_content',
			[
				'label' => esc_html__( 'Content Settings', 'surecart' ),
			]
		);

		$this->add_control(
			'thumbnails_per_page',
			[
				'label'       => esc_html__( 'Thumbnails per Page', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::NUMBER,
				'default'     => 5,
				'description' => esc_html__( 'Set the number of thumbnails to show per page.', 'surecart' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the widget style settings.
	 *
	 * @return void
	 */
	protected function register_style_settings() {
		$this->start_controls_section(
			'section_style',
			[
				'label' => esc_html__( 'Slider', 'surecart' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'lightbox',
			[
				'label'       => esc_html__( 'Enlarge on Click', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::SWITCHER,
				'label_on'    => esc_html__( 'Yes', 'surecart' ),
				'label_off'   => esc_html__( 'No', 'surecart' ),
				'default'     => 'yes',
				'description' => esc_html__( 'Scale images with a lightbox effect.', 'surecart' ),
			]
		);

		$this->add_control(
			'slider_is_auto_height',
			[
				'label'     => esc_html__( 'Auto Height', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::SWITCHER,
				'label_on'  => esc_html__( 'Yes', 'surecart' ),
				'label_off' => esc_html__( 'No', 'surecart' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'slider_height',
			[
				'label'      => esc_html__( 'Height', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'default'    => [
					'size' => 310,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-image-slider>.swiper' => 'height: {{SIZE}}{{UNIT}};',
				],
				'range'      => [
					'px'  => [
						'min' => 0,
						'max' => 1000,
					],
					'em'  => [
						'min' => 0,
						'max' => 100,
					],
					'rem' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'condition'  => [
					'slider_is_auto_height!' => 'yes',
				],
			]
		);

		$this->add_control(
			'slider_max_image_width',
			[
				'label'      => esc_html__( 'Max Image Width', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
				'selectors'  => [
					'{{WRAPPER}} .sc-image-slider>.swiper>.swiper-wrapper>.swiper-slide>img' => 'max-width: {{SIZE}}{{UNIT}};',
				],
				'range'      => [
					'px'  => [
						'min' => 0,
						'max' => 1000,
					],
					'em'  => [
						'min' => 0,
						'max' => 100,
					],
					'rem' => [
						'min' => 0,
						'max' => 100,
					],
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
		$settings = $this->get_settings_for_display();

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->swiper_template_before();
			?>
			<div class="swiper-wrapper sc-has-<?php echo esc_attr( $settings['thumbnails_per_page'] ); ?>-thumbs">
				<?php
				for ( $i = 0; $i < $settings['thumbnails_per_page']; $i++ ) {
					?>
						<div class="swiper-slide">
							<img src="<?php echo esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ); ?>" alt="Placeholder image" />
						</div>
						<?php
				}
				?>
			</div>
			<?php
			$this->swiper_template_after();
			return;
		}

		$attributes = array(
			'thumbnails_per_page' => $settings['thumbnails_per_page'],
			'auto_height'         => 'yes' === $settings['slider_is_auto_height'],
			'height'              => ! empty( $settings['slider_height']['size'] ) ? $settings['slider_height']['size'] . $settings['slider_height']['unit'] : '',
			'width'               => ! empty( $settings['slider_max_image_width']['size'] ) ? $settings['slider_max_image_width']['size'] . $settings['slider_max_image_width']['unit'] : '',
			'lightbox'            => 'yes' === $settings['lightbox'],
		);

		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-media <?php echo wp_json_encode( $attributes ); ?> /-->
		</div>
		<?php
	}

	/**
	 * Swiper template before.
	 *
	 * @return void
	 */
	private function swiper_template_before() {
		?>
		<div class="sc-image-slider">
			<div class="swiper">
				<div class="swiper-wrapper">
					<div class="swiper-slide">
						<img src="<?php echo esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ); ?>" alt="Placeholder image" />
					</div>
				</div>
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>
			</div>

			<div class="sc-image-slider__thumbs">
				<div
					class="sc-image-slider-button__prev"
					tabIndex="-1"
					role="button"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</div>

				<div class="swiper">
		<?php
	}

	/**
	 * Swiper template after.
	 *
	 * @return void
	 */
	private function swiper_template_after() {
		?>
			</div>
			<div
				class="sc-image-slider-button__next"
				tabIndex="-1"
				role="button"
			>
				<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		$this->swiper_template_before();
		?>
		<div class="swiper-wrapper sc-has-{{settings.thumbnails_per_page}}-thumbs">
			<# for ( var i = 0; i < settings.thumbnails_per_page; i++ ) { #>
				<div class="swiper-slide">
					<img src="<?php echo esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ); ?>" alt="<?php esc_attr_e( 'Placeholder image', 'surecart' ); ?>" />
				</div>
			<# } #>
		</div>
		<?php
		$this->swiper_template_after();
	}
}
