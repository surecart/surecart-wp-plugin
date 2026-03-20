<div
	class="sc-image-media"
	data-wp-class--sc-image-slider="state.active"
	data-wp-class--sc-image-gallery="!state.active"
	data-wp-interactive='{ "namespace": "surecart/image-slider" }'
	data-wp-init="actions.init"
	data-wp-on-window--resize="actions.init"
	data-wp-watch="actions.updateSlider"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $slider_options ) ); ?>
>
	<div class="swiper" style="height: <?php echo esc_attr( $height ); ?>">
		<div class="swiper-wrapper" data-wp-interactive='{ "namespace": "surecart/lightbox" }' <?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'images' => $product->gallery_ids ] ) ); ?>>
			<?php foreach ( $gallery as $index => $media ) : ?>
				<div
					data-wp-interactive='{ "namespace": "surecart/product-page" }'
					data-wp-class--swiper-slide="state.shouldDisplayImage"
					data-wp-style--display="state.imageDisplay"
					data-wp-key="<?php echo esc_attr( $media->id ); ?>"
					<?php
					echo wp_kses_data(
						wp_interactivity_data_wp_context(
							[
								'optionValue' => $media->getMetadata( 'variant_option' ),
							]
						)
					);
					?>
				>
					<?php
					$loading = $index > 0 ? 'lazy' : 'eager';
					include $media->isVideo() ? 'video.php' : 'image.php';
					?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
		<div class="swiper-pagination"></div>
	</div>

	<?php if ( ! empty( $attributes['show_thumbnails'] ) ) : ?>
		<div class="sc-image-slider__thumbs">
			<div class="sc-image-slider-button__prev" tabindex="-1" role="button" aria-label="<?php esc_attr_e( 'Previous Page', 'surecart' ); ?>">
				<?php echo wp_kses( SureCart::svg()->get( 'chevron-left' ), sc_allowed_svg_html() ); ?>
			</div>

			<div class="swiper">
				<div class="swiper-wrapper <?php echo esc_attr( 'sc-has-' . $attributes['thumbnails_per_page'] . '-thumbs' ); ?>">
					<?php foreach ( $gallery as $thumb_index => $media ) : ?>
						<div
							data-wp-interactive='{ "namespace": "surecart/product-page" }'
							data-wp-key="<?php echo esc_attr( $media->id ); ?>"
							data-wp-class--swiper-slide="state.shouldDisplayImage"
							data-wp-style--display="state.imageDisplay"
							<?php
							echo wp_kses_data(
								wp_interactivity_data_wp_context(
									[
										'optionValue' => $media->getMetadata( 'variant_option' ),
									]
								)
							);
							?>
						>
							<?php
								echo wp_kses(
									$media->{ $media->isVideo() ? 'video_thumbnail_html' : 'html' }(
										'thumbnail',
										array(
											'loading' => $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager',
										)
									),
									sc_allowed_svg_html()
								);
							?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="sc-image-slider-button__next" tabindex="-1" role="button" aria-label="<?php esc_attr_e( 'Next Page', 'surecart' ); ?>">
				<?php echo wp_kses( SureCart::svg()->get( 'chevron-right' ), sc_allowed_svg_html() ); ?>
			</div>
		</div>
	<?php endif; ?>
</div>