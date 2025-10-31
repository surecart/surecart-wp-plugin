<div <?php echo wp_kses_data( $wrapper_attrs ); ?>>
	<?php
	if ( ! empty( $attributes['show_label'] ) ) {
		$label = _n( 'review', 'reviews', $count, 'surecart' );
		echo esc_html(
			// translators: 1: number of reviews, 2: label "review" or "reviews".
			sprintf( '%s %s', $display_number, $label )
		);
	} else {
		echo esc_html( $display_number );
	}
	?>
</div>