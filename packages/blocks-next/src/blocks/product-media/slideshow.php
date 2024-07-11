<div
	class="sc-image-slider"
	data-wp-interactive='{ "namespace": "surecart/image-slider" }'
	data-wp-init="actions.init"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $slider_options ) ); ?>
>
	<div class="swiper" style="height: <?php echo esc_attr( $height ); ?>">
		<div class="swiper-wrapper">
			<?php foreach ( $gallery as $index => $image ) : ?>
				<div class="swiper-slide" data-wp-key="<?php echo esc_attr( $image->id ); ?>">
					<div class="swiper-zoom-container" data-swiper-zoom="5">
						<?php
							echo wp_kses_post(
								$image->html(
									'large',
									array_filter(
										[
											'loading' => $index > 0 ? 'lazy' : 'eager',
											'style'   => ( ! empty( $width ) ? 'max-width:' . esc_attr( $width ) : '' ) . ';' . ( empty( $attributes['auto_height'] ) && ! empty( $attributes['height'] ) ? "height: {$attributes['height']}" : '' ),
										]
									)
								)
							);
						?>
					</div>

					<?php if ( $index > 0 ) : ?>
						<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>

	<div class="sc-image-slider__thumbs">
		<div class="sc-image-slider-button__prev" tabindex="-1" role="button" aria-label="<?php esc_attr_e( 'Previous Page', 'surecart' ); ?>">
			<?php echo wp_kses( SureCart::svg()->get( 'chevron-left' ), sc_allowed_svg_html() ); ?>
		</div>

		<div class="swiper">
			<div class="swiper-wrapper <?php echo esc_attr( 'sc-has-' . $attributes['thumbnails_per_page'] . '-thumbs' ); ?>">
				<?php foreach ( $gallery as $thumb_index => $image ) : ?>
					<div
						class="swiper-slide"
						data-wp-key="<?php echo esc_attr( $image->id ); ?>"
						<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'slideIndex' => (int) $thumb_index ) ) ); ?>
					>
					<?php
						echo wp_kses_post(
							$image->html(
								'thumbnail',
								array(
									'loading' => $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager',
								)
							)
						);
					?>

						<?php if ( $thumb_index > $attributes['thumbnails_per_page'] ) : ?>
							<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="sc-image-slider-button__next" tabindex="-1" role="button" aria-label="<?php esc_attr_e( 'Next Page', 'surecart' ); ?>">
			<?php echo wp_kses( SureCart::svg()->get( 'chevron-right' ), sc_allowed_svg_html() ); ?>
		</div>
	</div>
</div>
