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
		return 'eicon-image-box';
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
	 * Get style dependencies.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'sc-image-slider', 'sc-product-media' );
	}

	/**
	 * Get script dependencies.
	 *
	 * @return array
	 */
	public function get_script_depends() {
		return array( '@surecart/image-slider' );
	}

	/**
	 * Register the widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		echo do_blocks( '<!-- wp:surecart/product-media /-->' );
	}

	/**
	 * Render the widget output on the editor.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<div class="sc-image-slider">
			<div class="swiper">
				<div class="swiper-wrapper">
					<div class="swiper-slide">
						<img src="https://via.placeholder.com/600x400" alt="Placeholder image" />
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
					<div class="swiper-wrapper sc-has-6-thumbs">
						<div class="swiper-slide">
							<img src="https://via.placeholder.com/600x400" alt="Placeholder image" />
						</div>
						<div class="swiper-slide">
							<img src="https://via.placeholder.com/600x400" alt="Placeholder image" />
						</div>
					</div>
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
}
