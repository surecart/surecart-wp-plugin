<div 
	class="sc-video-container"
	data-wp-interactive='{ "namespace": "surecart/video" }'
	data-wp-context='{
		"loaded": <?php echo ! empty( $autoplay ) ? 'true' : 'false'; ?>,
		"loading": false,
		"controls": <?php echo ! empty( $controls ) ? 'true' : 'false'; ?>,
		"autoplay": <?php echo ! empty( $autoplay ) ? 'true' : 'false'; ?>
	}'
	data-wp-init="callbacks.init"
	data-wp-on--click="actions.play"
	data-wp-class--sc-video-loaded="context.loaded"
	data-wp-class--sc-video-loading="context.loading"
	data-wp-on--fullscreenchange="callbacks.handleFullscreenChange"
	data-wp-watch--variant-change="callbacks.checkVariantChange"
	<?php if ( empty( $autoplay ) ) : ?>
	data-wp-on--mouseenter="callbacks.handleMouseEnter"
	<?php endif; ?>
	style="<?php echo esc_attr( $style ); ?>"
>
	<?php if ( empty( $autoplay ) ) : ?>
	<div
		role="button"
		class="sc-video-play-button" 
		aria-label="<?php echo esc_attr__( 'Play video', 'surecart' ); ?>" 
		data-wp-bind--hidden="context.loaded"
	>
		<?php echo wp_kses( \SureCart::svg()->get( 'play' ), sc_allowed_svg_html() ); ?>
	</div>
	<?php endif; ?>

	<video
		class="sc-video"
		data-wp-bind--controls="state.showControls"
		data-wp-on--play="callbacks.handlePlay"
		data-src="<?php echo esc_url( $src ); ?>"
		data-lazy="true"
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