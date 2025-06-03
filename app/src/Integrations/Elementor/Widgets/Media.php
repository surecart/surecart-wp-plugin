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
		return array( 'surecart-elementor-elements' );
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
			'desktop_gallery',
			[
				'label'   => esc_html__( 'Display Mode', 'surecart' ),
				'type'    => \Elementor\Controls_Manager::CHOOSE,
				'default' => 'slider',
				'options' => [
					'slider'  => [
						'title' => esc_html__( 'Slider View', 'surecart' ),
						'icon'  => 'eicon-image-before-after',
					],
					'gallery' => [
						'title' => esc_html__( 'Gallery View', 'surecart' ),
						'icon'  => 'eicon-gallery-grid',
					],
				],
				'toggle'  => false,
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
				'condition' => [
					'desktop_gallery' => 'slider',
				],
			],
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
					'px'     => array(
						'min' => 0,
						'max' => 1000,
					),
					'em'     => array(
						'min'  => 0,
						'step' => 0.1,
						'max'  => 10,
					),
					'%'      => array(
						'min' => 0,
						'max' => 100,
					),
					'rem'    => array(
						'min' => 0,
						'max' => 100,
					),
					'custom' => array(
						'min' => 0,
					),
				],
				'condition'  => [
					'slider_is_auto_height!' => 'yes',
					'desktop_gallery'        => 'slider',
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
					'{{WRAPPER}} .sc-image-gallery .swiper-wrapper .swiper-slide img' => 'max-width: {{SIZE}}{{UNIT}};',
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

		$this->add_control(
			'gallery_spacing',
			[
				'label'      => esc_html__( 'Gallery Spacing', 'surecart' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'default'    => [
					'size' => 1,
					'unit' => 'rem',
				],
				'selectors'  => [
					'{{WRAPPER}} .sc-image-gallery .swiper-wrapper' => 'gap: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .sc-image-gallery .swiper-wrapper .swiper-slide' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
				'range'      => [
					'px'  => [
						'min' => 0,
						'max' => 50,
					],
					'em'  => [
						'min' => 0,
						'max' => 5,
					],
					'rem' => [
						'min' => 0,
						'max' => 5,
					],
				],
				'condition'  => [
					'desktop_gallery' => 'gallery',
				],
			]
		);

		$this->add_control(
			'thumbnails_per_page',
			[
				'label'       => esc_html__( 'Thumbnails per Page', 'surecart' ),
				'type'        => \Elementor\Controls_Manager::NUMBER,
				'default'     => 5,
				'description' => esc_html__( 'Set the number of thumbnails to show per page.', 'surecart' ),
				'condition'   => [
					'desktop_gallery' => 'slider',
				],
			]
		);

		$this->add_control(
			'show_thumbs',
			[
				'label'     => esc_html__( 'Show Thumbnails', 'surecart' ),
				'type'      => \Elementor\Controls_Manager::SWITCHER,
				'label_on'  => esc_html__( 'Yes', 'surecart' ),
				'label_off' => esc_html__( 'No', 'surecart' ),
				'default'   => 'yes',
				'condition' => [
					'desktop_gallery' => 'slider',
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
	}

	/**
	 * Get the placeholder image URL.
	 *
	 * @return string
	 */
	private function get_placeholder_image(): string {
		return trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg';
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			$this->render_editor_content( $settings );
			return;
		}

		$auto_height = 'gallery' === $settings['desktop_gallery'] ? true : 'yes' === $settings['slider_is_auto_height'];
		$height      = ! $auto_height ? ( ! empty( $settings['slider_height']['size'] ) ? $settings['slider_height']['size'] . $settings['slider_height']['unit'] : '' ) : '';

		$attributes = array(
			'thumbnails_per_page' => $settings['thumbnails_per_page'],
			'auto_height'         => $auto_height,
			'height'              => $height,
			'width'               => ! empty( $settings['slider_max_image_width']['size'] ) ? $settings['slider_max_image_width']['size'] . $settings['slider_max_image_width']['unit'] : '',
			'lightbox'            => 'yes' === $settings['lightbox'],
			'desktop_gallery'     => 'gallery' === $settings['desktop_gallery'],
			'show_thumbs'         => 'yes' === $settings['show_thumbs'],
		);

		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<!-- wp:surecart/product-media <?php echo wp_json_encode( $attributes ); ?> /-->
		</div>
		<?php
	}

	/**
	 * Render content specifically for the editor with dynamic product data.
	 *
	 * @param array $settings Widget settings.
	 * @return void
	 */
	protected function render_editor_content( $settings ) {
		$this->add_render_attribute( 'wrapper', 'data-widget-type', $this->get_name() );
		$this->add_render_attribute( 'wrapper', 'data-surecart-dynamic', 'true' );

		// Get current product context.
		$product = sc_get_product();
		$images  = $this->get_product_images( $product );

		if ( 'gallery' === $settings['desktop_gallery'] ) {
			$this->render_gallery_view( $images, $settings );
		} else {
			$this->render_slider_view( $images, $settings );
		}
	}

	/**
	 * Get product images array.
	 *
	 * @param object|null $product Product object.
	 * @return array
	 */
	protected function get_product_images( $product ) {
		// Return placeholder images if no product or gallery is available.
		if ( ! $product || empty( $product->gallery ) ) {
			return array_fill(
				0,
				5,
				array(
					'src'   => $this->get_placeholder_image(),
					'width' => 1000,
					'alt'   => __( 'Placeholder image', 'surecart' ),
				)
			);
		}

		return array_map(
			function ( $image ) {
				return array(
					'src'   => $image->guid ? $image->guid : $this->get_placeholder_image(),
					'width' => $image->width ?? 1000,
					'alt'   => $image->alt ?? '',
				);
			},
			$product->gallery
		);
	}

	/**
	 * Render gallery view.
	 *
	 * @param array $images Array of images.
	 * @param array $settings Widget settings.
	 * @return void
	 */
	protected function render_gallery_view( $images, $settings ) {
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<div class="sc-image-gallery">
				<div class="swiper">
					<div class="swiper-wrapper">
						<?php foreach ( array_slice( $images, 0, 5 ) as $image ) : ?>
							<div class="swiper-slide" style="background: transparent;">
								<img 
									src="<?php echo esc_url( $image['src'] ); ?>" 
									alt="<?php echo esc_attr( $image['alt'] ); ?>" 
									width="<?php echo esc_attr( $image['width'] ); ?>" 
								/>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render slider view.
	 *
	 * @param array $images Array of images.
	 * @param array $settings Widget settings.
	 * @return void
	 */
	protected function render_slider_view( $images, $settings ) {
		$thumbnails_per_page = $settings['thumbnails_per_page'];
		$show_thumbs         = 'yes' === $settings['show_thumbs'];
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>
			<div class="sc-image-slider">
				<div class="swiper swiper-initialized">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<img 
								src="<?php echo esc_url( $images[0]['src'] ); ?>" 
								alt="<?php echo esc_attr( $images[0]['alt'] ); ?>" 
								width="<?php echo esc_attr( $images[0]['width'] ); ?>" 
							/>
						</div>
					</div>
					<div class="swiper-button-prev"></div>
					<div class="swiper-button-next"></div>
				</div>

				<?php if ( $show_thumbs ) : ?>
					<div class="sc-image-slider__thumbs">
						<div class="sc-image-slider-button__prev" tabIndex="-1" role="button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="15 18 9 12 15 6" />
							</svg>
						</div>

						<div class="swiper swiper-initialized">
							<div class="swiper-wrapper sc-has-<?php echo esc_attr( $thumbnails_per_page ); ?>-thumbs">
								<?php foreach ( array_slice( $images, 0, $thumbnails_per_page ) as $image ) : ?>
									<div class="swiper-slide" style="background: transparent;">
										<img 
											src="<?php echo esc_url( $image['src'] ); ?>" 
											alt="<?php echo esc_attr( $image['alt'] ); ?>" 
											width="<?php echo esc_attr( $image['width'] ); ?>" 
										/>
									</div>
								<?php endforeach; ?>
							</div>
						</div>

						<div class="sc-image-slider-button__next" tabIndex="-1" role="button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="9 18 15 12 9 6" />
							</svg>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<?php
	}
}
