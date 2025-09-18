<?php

$close_url = remove_query_arg( 'product-quick-view' );
?>
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
	data-wp-interactive='{ "namespace": "surecart/product-quick-view" }'
	data-wp-on--click="actions.close"
	data-wp-on--keydown="actions.close"
	data-wp-on--mouseenter="actions.prefetch"
	role="button"
	tabindex="0"
	aria-label="<?php esc_attr_e( 'Close quick add', 'surecart' ); ?>"
	href="<?php echo esc_url( $close_url ); ?>">
	<?php echo wp_kses( SureCart::svg()->get( 'x' ), sc_allowed_svg_html() ); ?>
</a>