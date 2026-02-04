<?php
// no context, stop processing.
if ( empty( $block->context['surecart/checkbox'] ) ) {
	return;
}

$checkbox = (object) $block->context['surecart/checkbox'];

// return the disabled if no reviews for this rating.
if ( ! empty( $checkbox->disabled ) ) {
	return 'file:./disabled.php';
}

// return the view.
return 'file:./view.php';
