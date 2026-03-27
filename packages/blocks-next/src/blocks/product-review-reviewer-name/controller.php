<?php

if ( empty( $block->context['review'] ) ) {
	return;
}

$customer = $block->context['review']->customer ?? null;
if ( empty( $customer ) ) {
	return '';
}

$format         = $attributes['format'] ?? 'display_name';
$formatted_name = '';

switch ( $format ) {
	case 'first_name':
		$formatted_name = $customer->first_name;
		break;

	case 'last_name':
		$formatted_name = $customer->last_name;
		break;

	case 'first_last':
		$formatted_name = trim( implode( ' ', array_filter( [ $customer->first_name ?? '', $customer->last_name ?? '' ] ) ) );
		break;

	case 'display_name':
	default:
		$formatted_name = $customer->name;
		break;
}

// Fallback name.
$anonymous_label = apply_filters( 'sc_anonymous_reviewer_name', __( 'Anonymous', 'surecart' ) );
$formatted_name  = $formatted_name ?? $customer->name ?? $anonymous_label;

return 'file:./view.php';
