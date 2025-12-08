<div 
	class="sc-video-container"
	data-wp-interactive='{ "namespace": "surecart/video" }'
	data-wp-context='{ "loaded": false }'
	data-wp-on--click="actions.play"
	data-wp-class--sc-video-loaded="context.loaded"
	data-wp-on--fullscreenchange="callbacks.handleFullscreenChange"
	data-wp-watch--variant-change="callbacks.checkVariantChange"
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
		data-wp-bind--controls="context.loaded"
		data-wp-on--play="callbacks.handlePlay"
		src="<?php echo esc_url( $src ); ?>"
		poster="<?php echo esc_url( $poster ); ?>"
		playsinline
		preload="none"
		alt="<?php echo esc_attr( $alt ); ?>"
		title="<?php echo esc_attr( $title ); ?>">
	</video>
</div>