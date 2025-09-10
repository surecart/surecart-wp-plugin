<div class="sc-video-container"
			data-wp-interactive='{ "namespace": "surecart/video" }'
			data-wp-context='{ "isVideoPlaying": false }'
			data-wp-on--click="actions.play"
			style="<?php echo esc_attr( $style ); ?>"
		>
			<div class="sc-video-overlay" data-wp-bind--hidden="context.isVideoPlaying">
				<img src="<?php echo esc_url( $poster_image ); ?>" alt="
					<?php
						echo esc_attr(
							sprintf(
							// translators: %s is the video title.
								__( 'Video thumbnail for %s', 'surecart' ),
								$this->item->post_title ?? ''
							)
						);
						?>
				" />

				<div aria-role="button" tabindex="0" class="sc-video-play-button" aria-label="<?php echo esc_attr__( 'Play video', 'surecart' ); ?>">
					<?php echo wp_kses( \SureCart::svg()->get( 'play', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>

					<span class="screen-reader-text">
						<?php
						echo esc_html(
							sprintf(
							// translators: %s is the video title.
								__( 'Play video: %s', 'surecart' ),
								$this->item->post_title ?? ''
							)
						);
						?>
					</span>
				</div>
			</div>
			
			<div class="sc-video-player-container" data-wp-bind--hidden="!context.isVideoPlaying">
				<?php
				echo wp_kses_post(
					apply_filters(
						'surecart_product_video_html',
						wp_sprintf(
							'<video
								class="sc-video-player"
								src="%s"
								poster="%s"
								loop
								muted
								controls
								playsinline
								preload="none"
								aria-label="%s"
								title="%s"
							></video>',
							esc_url( $video_url ),
							esc_url( $poster_image ),
							// translators: %s is the video title.
							esc_attr( sprintf( __( 'Product Video: %s', 'surecart' ), $this->item->post_title ?? '' ) ),
							esc_attr( $this->item->post_title ?? '' )
						)
					)
				);
				?>
			</div>
		</div>