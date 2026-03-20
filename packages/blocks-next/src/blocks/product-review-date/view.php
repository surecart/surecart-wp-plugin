<?php
	printf(
		'<div %1$s><time datetime="%2$s" aria-label="%4$s">%3$s</time></div>',
		$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		$unformatted_date, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		$formatted_date, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		/* translators: %s: formatted date of the review */
		esc_attr( sprintf( __( 'Reviewed on %s', 'surecart' ), $formatted_date ) )
	);
