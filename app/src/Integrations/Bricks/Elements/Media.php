<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Media element.
 */
class Media extends \Bricks\Element {
	use ConvertsBlocks; // we have to use a trait since we can't extend the surecart class.

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
	public $name = 'surecart-product-media';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-media';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-slider-alt';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product media', 'surecart' );
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_style( 'surecart-image-slider' );
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['desktop_gallery'] = [
			'tab'        => 'content',
			'label'      => esc_html__( 'Display Mode', 'surecart' ),
			'type'       => 'select',
			'options'    => [
				'slider'  => esc_html__( 'Slider View', 'surecart' ),
				'gallery' => esc_html__( 'Gallery View', 'surecart' ),
			],
			'inline'     => true,
			'fullAccess' => true,
			'default'    => 'slider',
		];

		$this->controls['auto_height'] = [
			'tab'        => 'content',
			'label'      => esc_html__( 'Auto height', 'surecart' ),
			'type'       => 'checkbox',
			'inline'     => true,
			'fullAccess' => true,
			'default'    => true,
			'required'   => [
				[ 'desktop_gallery', '=', 'slider' ],
			],
		];

		$this->controls['lightbox'] = [
			'tab'        => 'content',
			'label'      => esc_html__( 'Enlarge on click', 'surecart' ),
			'type'       => 'checkbox',
			'inline'     => true,
			'fullAccess' => true,
			'default'    => true,
		];

		$this->controls['height'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Height', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '310px',
			'placeholder' => '310px',
			'required'    => [
				[ 'auto_height', '!=', true ],
				[ 'desktop_gallery', '=', 'slider' ],
			],
			'fullAccess'  => true,
		];

		$this->controls['max_image_width'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Max image width', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'placeholder' => esc_html__( 'Unlimited', 'surecart' ),
		];

		$this->controls['gallery_spacing'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Gallery Spacing', 'surecart' ),
			'type'        => 'number',
			'units'       => true,
			'default'     => '1rem',
			'placeholder' => '1rem',
			'css'         => [
				[
					'property' => 'gap',
					'selector' => '&.sc-image-gallery .swiper-wrapper',
				],
				[
					'property' => 'margin-bottom',
					'selector' => '&.sc-image-gallery .swiper-wrapper .swiper-slide',
				],
			],
			'required'    => [
				[ 'desktop_gallery', '=', 'gallery' ],
			],
		];

		$this->controls['thumbnails_per_page'] = [
			'tab'         => 'content',
			'label'       => esc_html__( 'Thumbs per page', 'surecart' ),
			'type'        => 'number',
			'default'     => 5,
			'min'         => 2,
			'placeholder' => 5,
			'required'    => [
				[ 'desktop_gallery', '=', 'slider' ],
			],
		];

		$this->controls['show_thumbs'] = [
			'tab'        => 'content',
			'label'      => esc_html__( 'Show Thumbnails', 'surecart' ),
			'type'       => 'checkbox',
			'inline'     => true,
			'fullAccess' => true,
			'default'    => true,
			'required'   => [
				[ 'desktop_gallery', '=', 'slider' ],
			],
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$product             = sc_get_product();
		$settings            = $this->settings;
		$thumbnails_per_page = ! empty( $settings['thumbnails_per_page'] ) ? (int) $settings['thumbnails_per_page'] : 5;
		$desktop_gallery     = ! empty( $settings['desktop_gallery'] ) ? $settings['desktop_gallery'] : 'slider';

		if ( $this->is_admin_editor() ) {
			if ( 'gallery' === $desktop_gallery ) {
				$content = '<div class="sc-image-gallery"><div class="swiper swiper-initialized"><div class="swiper-wrapper">';
				for ( $i = 0; $i < 3; $i++ ) {
					$content .= '<div class="swiper-slide">';
					$content .= '<img src="' . esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ) . '"';
					$content .= ' style="' . ( ! empty( $this->settings['max_image_width'] ) ? 'max-width:' . esc_attr( $this->settings['max_image_width'] ) : '' ) . '"';
					$content .= ' alt="' . esc_attr( get_the_title() ) . '" />';
					$content .= '</div>';
				}
				$content .= '</div></div></div>';
				$content .= '<div class="bricks-element-placeholder" data-type="info" draggable="false"><i class="ti-layout-slider-alt"></i><div class="placeholder-inner"><div class="placeholder-description">' . __( 'The accurate preview for this element is only available on frontend due to compatibility issues.', 'surecart' ) . '</div></div></div>';
			} else {
				$content  = '<div class="sc-image-slider"><div class="swiper swiper-initialized"><div class="swiper-wrapper">';
				$content .= '<div class="swiper-slide"><img src="' . esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ) . '"';
				$content .= ' style="' . ( ! empty( $this->settings['max_image_width'] ) ? 'max-width:' . esc_attr( $this->settings['max_image_width'] ) : '' ) . '"';
				$content .= ' alt="' . esc_attr( get_the_title() ) . '" /></div>';
				$content .= '</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>';

				if ( ! empty( $this->settings['show_thumbs'] ) ) {
					$content .= '<div class="sc-image-slider__thumbs"><div class="swiper swiper-initialized"><div class="swiper-wrapper sc-has-' . $thumbnails_per_page . '-thumbs">';
					for ( $i = 0; $i < $thumbnails_per_page; $i++ ) {
						$content .= '<div class="swiper-slide">';
						$content .= '<img src="' . esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ) . '"';
						$content .= ' alt="' . esc_attr( get_the_title() ) . '" />';
						$content .= '</div>';
					}
					$content .= '</div></div></div>';
				}
				$content .= '</div>';
				$content .= '<div class="bricks-element-placeholder" data-type="info" draggable="false"><i class="ti-layout-slider-alt"></i><div class="placeholder-inner"><div class="placeholder-description">' . __( 'The accurate preview for this element is only available on frontend due to compatibility issues.', 'surecart' ) . '</div></div></div>';
			}

			echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				$content,
				'',
				'figure'
			);

			return;
		}

		$auto_height = 'gallery' === $desktop_gallery ? true : ! empty( $settings['auto_height'] );
		$height      = ! $auto_height ? ( ! empty( $settings['height'] ) ? $settings['height'] : '310px' ) : '';

		echo $this->html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			[
				'auto_height'         => $auto_height,
				'height'              => $height,
				'lightbox'            => (bool) ! empty( $this->settings['lightbox'] ),
				'width'               => esc_html( $this->settings['max_image_width'] ?? null ),
				'thumbnails_per_page' => $thumbnails_per_page,
				'desktop_gallery'     => 'gallery' === $desktop_gallery,
				'show_thumbs'         => (bool) ! empty( $this->settings['show_thumbs'] ),
			]
		);
	}
}
