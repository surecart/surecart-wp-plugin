<?php

$attributes = array(
	'thumbnails_per_page' => 5,
	'auto_height'         => false,
	'height'              => '500px',
	'has_thumbnails'      => true,
);

$product    = \SureCart\Models\Product::with( array( 'image', 'prices', 'product_medias', 'variant_options', 'variants', 'product_media.media', 'product_collections' ) )->find( '78b2e3ec-4d3c-4976-886e-73f2c13f82ea' );
$images     = $product->getDisplayImages( $content_width ?? 1170 );
$thumbnails = $product->getDisplayImages( 240, array( 90, 120, 240 ) );
?>

<div
	class="sc-image-slider"
	data-wp-interactive='{ "namespace": "surecart/image-slider" }'
	data-wp-init="surecart/image-slider::actions.init"
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'currentSliderIndex' => 0,
				'thumbnailsPerPage'  => $attributes['thumbnails_per_page'] ?? 5,
				'autoHeight'         => ! empty( $attributes['auto_height'] ),
				'isFixedHeight'      => empty( $attributes['auto_height'] ),
				'hasThumbnails'      => $attributes['has_thumbnails'],
				'slideCount'         => count( $images ),
			)
		)
	);
	?>>
	<div class="swiper sc-image-slider__swiper">
		<div class="sc-image-slider__swiper-wrapper">
			<?php foreach ( $images as $index => $image ) : ?>
				<div class="swiper-slide sc-image-slider__slider" data-wp-key="<?php echo esc_attr( $image['id'] ); ?>">
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
				</div>
			<?php endforeach; ?>
		</div>
	</div>

	<?php
	if ( $attributes['has_thumbnails'] ) {
		?>
		<div class="sc-image-slider__thumbs sc-image-slider__thumbs--has-navigation">
		<div class="sc-image-slider__navigation sc-image-slider--is-prev" tabindex="0" role="button">
			<?php echo \SureCart::svg()->get( 'chevron-left' ); ?>
		</div>

		<div class="swiper swiper sc-image-slider__thumbs-swiper">
			<?php // translators: Products slide options section. There are %d options present. ?>
			<div class="sc-image-slider__swiper-wrapper" role="radiogroup">
				<?php
				foreach ( $thumbnails as $thumb_index => $thumbnail ) {
					?>
					<div
						class="swiper-slide sc-image-slider__thumb"
						role="radio"
						data-wp-bind--aria-checked="surecart/image-slider::context.isActiveSlide"
						data-wp-key="<?php echo esc_attr( 'swiper-thumb-' . $thumbnail['id'] ); ?>"
						<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'slideIndex' => (int) $thumb_index ) ) ); ?>
						tabindex="0"
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
						/>
					</div>
					<?php
				}
				?>
			</div>
		</div>

		<div class="sc-image-slider__navigation sc-image-slider--is-next" tabindex="0" role="button">
			<?php echo \SureCart::svg()->get( 'chevron-right' ); ?>
		</div>
	</div>
		<?php
	}
	?>
</div>
