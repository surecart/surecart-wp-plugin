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
				<?php
				// Check if this is a video.
				$is_video = false;
				if ( isset( $media->item->media ) && isset( $media->item->media->mime_type ) && strpos( $media->item->media->mime_type, 'video' ) !== false ) {
					$is_video = true;
				} elseif ( isset( $media->item->url ) ) {
					$file_extension = pathinfo( $media->item->url, PATHINFO_EXTENSION );
					if ( in_array( strtolower( $file_extension ), [ 'mp4', 'webm', 'ogg' ] ) ) {
						$is_video = true;
					}
				}
				?>
				<div
					data-wp-interactive='{ "namespace": "surecart/product-page" }'
					data-wp-key="<?php echo esc_attr( $media->id ); ?>"
					data-wp-class--swiper-slide="state.shouldDisplayImage"
					data-wp-style--display="state.imageDisplay"
					<?php
					echo wp_kses_data(
						wp_interactivity_data_wp_context(
							[
								'optionValue' => $media->variant_option,
							]
						)
					);
					?>
				>
					<div
						data-wp-interactive='{ "namespace": "surecart/lightbox" }'
						<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => $is_video ? 'sc-video-container' : 'sc-lightbox-container' ] ) ); ?>
						<?php
						echo wp_kses_data(
							wp_interactivity_data_wp_context(
								[
									'imageId' => $media->id, // this is needed to keep track of the image in the lightbox.
								]
							)
						);
						?>
					>
						<?php
							echo wp_kses(
								$media->withLightbox( $is_video ? false : $attributes['lightbox'] )->html(
									'large',
									array_filter(
										[
											'loading' => $index > 0 ? 'lazy' : 'eager',
											'style'   => ( ! empty( $width ) ? 'max-width : min(' . esc_attr( $width ) . ', 100%);' : '' ) . ';' . ( ! $auto_height && ! empty( $attributes['height'] ) ? "height: {$attributes['height']}" : '' ),
										]
									)
								),
								sc_allowed_svg_html()
							);
						?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>

	<?php if ( ! empty( $attributes['show_thumbs'] ) ) : ?>
		<div class="sc-image-slider__thumbs">
			<div class="sc-image-slider-button__prev" tabindex="-1" role="button" aria-label="<?php esc_attr_e( 'Previous Page', 'surecart' ); ?>">
				<?php echo wp_kses( SureCart::svg()->get( 'chevron-left' ), sc_allowed_svg_html() ); ?>
			</div>

			<div class="swiper">
				<div class="swiper-wrapper <?php echo esc_attr( 'sc-has-' . $attributes['thumbnails_per_page'] . '-thumbs' ); ?>">
					<?php foreach ( $gallery as $thumb_index => $media ) : ?>
						<?php
						// Check if this is a video for thumbnail.
						$is_video_thumb = false;
						if ( isset( $media->item->media ) && isset( $media->item->media->mime_type ) && strpos( $media->item->media->mime_type, 'video' ) !== false ) {
							$is_video_thumb = true;
						} elseif ( isset( $media->item->url ) ) {
							$file_extension = pathinfo( $media->item->url, PATHINFO_EXTENSION );
							if ( in_array( strtolower( $file_extension ), [ 'mp4', 'webm', 'ogg' ] ) ) {
								$is_video_thumb = true;
							}
						}
						?>
						<div
							data-wp-interactive='{ "namespace": "surecart/product-page" }'
							data-wp-key="<?php echo esc_attr( $media->id ); ?>"
							data-wp-class--swiper-slide="state.shouldDisplayImage"
							data-wp-style--display="state.imageDisplay"
							<?php
							echo wp_kses_data(
								wp_interactivity_data_wp_context(
									[
										'optionValue' => $media->variant_option,
									]
								)
							);
							?>
						>
							<?php if ( $is_video_thumb ) : ?>
								<div class="sc-video-thumbnail">
									<?php
									// For video thumbnails, use a reliable thumbnail image.
									if ( method_exists( $media, 'get_video_thumbnail_url' ) ) {
										// If the media object has the method to get video thumbnails.
										if ( isset( $media->item->ID ) ) {
											$thumbnail_url = $media->get_video_thumbnail_url( $media->item->ID );
										} else {
											$thumbnail_url = $media->get_video_thumbnail_url();
										}

										echo '<img src="' . esc_url( $thumbnail_url ) . '" alt="' . esc_attr__( 'Video thumbnail', 'surecart' ) . '" loading="' .
											( $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager' ) . '" />';
									} else {
										// Fallback to the default html method.
										echo wp_kses_post(
											$media->html(
												'thumbnail',
												array(
													'loading' => $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager',
												)
											)
										);
									}
									?>
									<div class="sc-video-play-button"></div>
								</div>
							<?php else : ?>
								<?php
								echo wp_kses_post(
									$media->html(
										'thumbnail',
										array(
											'loading' => $thumb_index > $attributes['thumbnails_per_page'] ? 'lazy' : 'eager',
										)
									)
								);
								?>
							<?php endif; ?>
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
