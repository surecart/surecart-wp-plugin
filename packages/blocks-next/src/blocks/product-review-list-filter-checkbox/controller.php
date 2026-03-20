<?php
// no context, stop processing.
if ( empty( $block->context['surecart/checkbox'] ) ) {
	return;
}

$checkbox   = (object) $block->context['surecart/checkbox'];
$aria_label = ! empty( $checkbox->aria_label ) ? $checkbox->aria_label : $checkbox->label;

// return the disabled if no reviews for this rating.
if ( ! empty( $checkbox->disabled ) ) {
	// translators: %s is the filter label (e.g. "Filter by 5 star reviews, 0 results").
	$aria_label_disabled = sprintf( __( '%s, unavailable', 'surecart' ), $aria_label );
	return 'file:./disabled.php';
}

// return the view.
return 'file:./view.php';
