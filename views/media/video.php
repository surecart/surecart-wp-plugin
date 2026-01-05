<div
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'loaded'   => ! empty( $autoplay ),
				'controls' => ! empty( $controls ),
				'autoplay' => ! empty( $autoplay ),
			]
		)
	);
	?>
	class="sc-video-container"
	data-wp-interactive='{ "namespace": "surecart/video" }'
	data-wp-on--click="callbacks.play"
	style="<?php echo esc_attr( $style ); ?>"
>
	<div
		role="button"
		class="sc-video-play-button"
		aria-label="<?php echo esc_attr__( 'Play video', 'surecart' ); ?>"
		data-wp-bind--hidden="context.loaded"
	>
		<?php echo wp_kses( \SureCart::svg()->get( 'play' ), sc_allowed_svg_html() ); ?>
	</div>

	<video
		class="sc-video"
		data-wp-run="callbacks.loadInView"
		data-wp-bind--controls="state.showControls"
		data-wp-on--play="callbacks.handlePlay"
		data-src="<?php echo esc_url( $src ); ?>"
		poster="<?php echo esc_url( $poster ); ?>"
		playsinline
		preload="<?php echo ! empty( $autoplay ) ? 'auto' : 'none'; ?>"
		alt="<?php echo esc_attr( $alt ); ?>"
		title="<?php echo esc_attr( $title ); ?>"
		<?php echo ! empty( $autoplay ) ? 'autoplay' : ''; ?>
		<?php echo ! empty( $muted ) ? 'muted' : ''; ?>
		<?php echo ! empty( $loop ) ? 'loop' : ''; ?>>
	</video>
</div>
