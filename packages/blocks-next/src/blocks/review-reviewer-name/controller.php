<?php
if ( empty( $block->context['review'] ) ) {
	return;
}

$customer = $block->context['review']->customer ?? null;
$format   = $attributes['format'] ?? 'display_name';

$formatted_name = '';

switch ( $format ) {
	case 'first_name':
		$formatted_name = $customer->first_name ?? $customer->name ?? $customer->email ?? '';
		break;

	case 'last_name':
		$formatted_name = $customer->last_name ?? $customer->name ?? $customer->email ?? '';
		break;

	case 'first_last':
		$first_name = $customer->first_name ?? '';
		$last_name  = $customer->last_name ?? '';
		if ( ! empty( $first_name ) && ! empty( $last_name ) ) {
			$formatted_name = trim( $first_name . ' ' . $last_name );
		} else {
			$formatted_name = $customer->name ?? $customer->email ?? '';
		}
		break;

	case 'display_name':
	default:
		$formatted_name = $customer->name ?? $customer->email ?? '';
		break;
}

return 'file:./view.php';
