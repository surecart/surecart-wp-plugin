<?php $close_url = get_permalink(); ?>

<a
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'url' => sanitize_url( $close_url ),
			]
		)
	);
	?>
	data-wp-interactive='{ "namespace": "surecart/product-review-form" }'
	data-wp-on--click="actions.close"
	data-wp-on--keydown="actions.close"
	role="button"
	tabindex="0"
	aria-label="<?php esc_attr_e( 'Close product review form', 'surecart' ); ?>"
	href="<?php echo esc_url( $close_url ); ?>">
	<?php echo wp_kses( SureCart::svg()->get( 'x', [ 'aria-hidden' => 'true' ] ), sc_allowed_svg_html() ); ?>
</a>