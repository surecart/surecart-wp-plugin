<?php

use SureCart\Support\TimeDate;

if ( empty( $block->context['review'] ) ) {
	return;
}

$classes          = array();
$review_timestamp = (int) $block->context['review']->created_at ?? '';
$unformatted_date = TimeDate::formatDateAndTime( $review_timestamp );

if ( isset( $attributes['format'] ) && 'human-diff' === $attributes['format'] ) {
	if ( $review_timestamp > time() ) {
		// translators: %s: human-readable time difference.
		$formatted_date = sprintf( __( '%s from now' ), human_time_diff( $review_timestamp ) );
	} else {
		// translators: %s: human-readable time difference.
		$formatted_date = sprintf( __( '%s ago' ), human_time_diff( $review_timestamp ) );
	}
} else {
	$format         = empty( $attributes['format'] ) ? get_option( 'date_format' ) : $attributes['format'];
	$formatted_date = wp_date( $format, $review_timestamp );
}

if ( isset( $attributes['textAlign'] ) ) {
	$classes[] = 'has-text-align-' . $attributes['textAlign'];
}
if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classes[] = 'has-link-color';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

return 'file:./view.php';
