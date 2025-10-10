<div class="sc-video-thumbnail">
	<img class="<?php echo esc_attr( $class ?? '' ); ?>" src="<?php echo esc_url( $src ?? '' ); ?>" alt="<?php echo esc_attr( $alt ?? '' ); ?>">
	<div aria-role="button" tabindex="0" class="sc-video-play-button" aria-label="<?php echo esc_attr__( 'Play video', 'surecart' ); ?>">
		<?php
		echo wp_kses(
			\SureCart::svg()->get(
				'play',
				[
					'width'  => 12,
					'height' => 12,
					'class'  => '',
				]
			),
			sc_allowed_svg_html()
		);
		?>
		<span class="screen-reader-text">
			<?php
			// translators: %s is the video title.
			echo esc_html( sprintf( __( 'Play video: %s', 'surecart' ), $title ?? '' ) );
			?>
		</span>
	</div>
</div>