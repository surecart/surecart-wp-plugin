<?php

$attributes = array(
	'thumbnails_per_page' => 5,
	'auto_height'         => false,
	'height'              => '600px',
	'has_thumbnails'      => true,
);

$product    = \SureCart\Models\Product::with( array( 'image', 'prices', 'product_medias', 'variant_options', 'variants', 'product_media.media', 'product_collections' ) )->find( 'bfa320d8-48c0-41b5-9dc4-02df69a0b7de' );
$images     = $product->getImages( $content_width ?? 1170 );
$thumbnails = $product->getImages( 240, array( 90, 120, 240 ) );

$context = array(
	'currentSliderIndex' => 0,
	'thumbnailsPerPage'  => $attributes['thumbnails_per_page'] ?? 5,
	'autoHeight'         => ! empty( $attributes['auto_height'] ),
	'isFixedHeight'      => empty( $attributes['auto_height'] ),
	'hasThumbnails'      => $attributes['has_thumbnails'],
)
?>

<div
	class="image-slider"
	data-wp-interactive='{ "namespace": "surecart/image-slider" }'
	data-wp-init="surecart/image-slider::actions.init"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $context ) ); ?>
	data-wp-class-image-slider--is-fixed-height="surecart/image-slider::context.isFixedHeight"
	style="--sc-product-slider-height: <?php echo esc_attr( ! empty( $attributes['auto_height'] ) ? 'auto' : ( esc_attr( $attributes['height'] ?? 'auto' ) ) ); ?>"
 >
	<div class="swiper image-slider__swiper">
		<div class="swiper-wrapper">
			<?php
			$image_index = 0;
			foreach ( $images as $image ) {
				?>
				<div class="swiper-slide image-slider__slider">
					<div class="swiper-slide-img">
						<img
							src="<?php echo esc_url( $image['src'] ); ?>"
							alt="<?php echo esc_attr( $image['alt'] ); ?>"
							srcset="<?php echo esc_attr( $image['srcset'] ); ?>"
							width="<?php echo esc_attr( $image['width'] ); ?>"
							height="<?php echo esc_attr( $image['height'] ); ?>"
							title="<?php echo esc_attr( $image['title'] ); ?>"
							loading="<?php echo esc_attr( $image_index > 0 ? 'lazy' : 'eager' ); ?>"
							data-wp-key="<?php echo esc_attr( $image['title'] . '-slide-' . $image_index ); ?>"
						/>
					</div>
				</div>
				<?php
				$image_index++;
			}
			?>
		</div>
	</div>

	<?php
	if ( $context['hasThumbnails'] ) {
		?>
		<div class="image-slider__thumbs image-slider__thumbs--has-navigation">
		<button class="image-slider__navigation image-slider--is-prev">
			<sc-visually-hidden><?php echo esc_html( __( 'Go to previous product slide.', 'surecart' ) ); ?></sc-visually-hidden>
			<sc-icon name="chevron-left" aria-hidden="true" tab-index="0"  />
		</button>

		<div class="swiper swiper image-slider__thumbs-swiper">
			<?php // translators: Products slide options section. There are %d options present. ?>
			<div class="swiper-wrapper" role="radiogroup" aria-label="<?php esc_attr( sprintf( __( 'Products slide options section. There are %d options present.', 'surecart' ), 4 ) ); ?>">
				<?php
				$thumb_index = 0;
				foreach ( $thumbnails as $thumbnail ) {
					?>
					<button
						class="swiper-slide image-slider__thumb"
						role="radio"
						aria-checked="surecart/image-slider::context.isActiveSlide"
						tabindex="0"
						<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'slideIndex' => $thumb_index ] ) ); ?>
					>
						<img
							src="<?php echo esc_url( $thumbnail['src'] ); ?>"
							<?php // translators: Product image number %1$1d, %2$2s. ?>
							alt="<?php echo esc_attr( sprintf( __( 'Product image number %1$1d, %2$2s.', 'surecart' ), $thumb_index + 1, $thumbnail['alt'] ) ); ?>"
							title="<?php echo esc_attr( $thumbnail['title'] ); ?>"
							srcset="<?php echo esc_attr( $thumbnail['srcset'] ); ?>"
							width="<?php echo esc_attr( $thumbnail['width'] ); ?>"
							height="<?php echo esc_attr( $thumbnail['height'] ); ?>"
							loading="<?php echo esc_attr( $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager' ); ?>"
							data-wp-key="<?php echo esc_attr( $thumbnail['title'] . '-thumb-' . $thumb_index ); ?>"
						/>
					</button>
					<?php
					$thumb_index++;
				}
				?>
			</div>
		</div>

		<button class="image-slider__navigation image-slider--is-next">
			<sc-visually-hidden><?php echo esc_html( __( 'Go to next product slide.', 'surecart' ) ); ?></sc-visually-hidden>
			<sc-icon name="chevron-right" aria-hidden="true" tab-index="0" />
		</button>
	</div>
		<?php
	}
	?>
</div>
