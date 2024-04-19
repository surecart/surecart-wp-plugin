<?php

$attributes = array(
	'thumbnails_per_page' => 5,
	'auto_height'         => false,
	'height'              => '500px',
	'has_thumbnails'      => true,
);

$product    = \SureCart\Models\Product::with( array( 'image', 'prices', 'product_medias', 'variant_options', 'variants', 'product_media.media', 'product_collections' ) )->find( 'b29dd028-b331-4ac9-896b-537ff39e8fc2' );
$images     = $product->getDisplayImages( $content_width ?? 1170 );
$thumbnails = $product->getDisplayImages( 240, array( 90, 120, 240 ) );
?>

<div
	class="sc-image-slider"
	data-wp-interactive='{ "namespace": "surecart/image-slider" }'
	data-wp-init="actions.init"
	<?php
	echo wp_interactivity_data_wp_context(
		array(
			'sliderOptions' => [
				'autoHeight' => ! empty( $attributes['auto_height'] ),
			],
			'thumbSliderOptions' => [
				'slidesPerView' => $attributes['thumbnails_per_page'] ?? 5,
				'slidesPerGroup' => $attributes['thumbnails_per_page'] ?? 5,
				'breakpoints' => [
					320 => [
						'slidesPerView' => $attributes['thumbnails_per_page'] ?? 5,
						'slidesPerGroup' => $attributes['thumbnails_per_page'] ?? 5,
					]
				]
			],
		)
	);
	?>>
	<div class="swiper">
		<div class="swiper-wrapper">
			<?php foreach ( $images as $index => $image ) : ?>
				<div class="swiper-slide" data-wp-key="<?php echo esc_attr( $image['id'] ); ?>">
					<img
						src="<?php echo esc_url( $image['src'] ); ?>"
						alt="<?php echo esc_attr( $image['alt'] ); ?>"
						srcset="<?php echo esc_attr( $image['srcset'] ?? '' ); ?>"
						width="<?php echo esc_attr( $image['width'] ); ?>"
						height="<?php echo esc_attr( $image['height'] ); ?>"
						title="<?php echo esc_attr( $image['title'] ); ?>"
						loading="<?php echo esc_attr( $index > 0 ? 'lazy' : 'eager' ); ?>"
						style="height: <?php echo esc_attr( ! empty( $attributes['auto_height'] ) ? 'auto' : ( esc_attr( $attributes['height'] ?? 'auto' ) ) ); ?>"
					/>

					<?php if ($index > 0) : ?>
						<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>

	<?php if ( $attributes['has_thumbnails'] ) { ?>
		<div class="sc-image-slider__thumbs">
			<div class="sc-image-slider-button__prev" tabindex="-1" role="button">
				<?php echo wp_kses( SureCart::svg()->get( 'chevron-left' ), sc_allowed_svg_html() ); ?>
			</div>

			<div class="swiper">
				<div class="swiper-wrapper <?php echo esc_attr('sc-has-' . $attributes['thumbnails_per_page'] . '-thumbs' ); ?>">
					<?php foreach ( $thumbnails as $thumb_index => $thumbnail ) : ?>
						<div
							class="swiper-slide"
							data-wp-key="<?php echo esc_attr( $thumbnail['id'] ); ?>"
							<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'slideIndex' => (int) $thumb_index ) ) ); ?>
						>
							<img
								src="<?php echo esc_url( $thumbnail['src'] ); ?>"
								alt="<?php echo esc_attr( $image['alt'] ); ?>"
								title="<?php echo esc_attr( $thumbnail['title'] ); ?>"
								srcset="<?php echo esc_attr( $thumbnail['srcset'] ); ?>"
								width="<?php echo esc_attr( $thumbnail['width'] ); ?>"
								height="<?php echo esc_attr( $thumbnail['height'] ); ?>"
								loading="<?php echo esc_attr( $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager' ); ?>"
							/>

							<?php if ($thumb_index > $attributes['thumbnails_per_page']) : ?>
								<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="sc-image-slider-button__next" tabindex="-1" role="button">
				<?php echo wp_kses( SureCart::svg()->get( 'chevron-right' ), sc_allowed_svg_html() ); ?>
			</div>
		</div>
	<?php } ?>
</div>
