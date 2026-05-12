<?php
$current_option = $block->context['surecart/bundleItemOption'] ?? null;
$option_name    = $current_option->name ?? '';

if ( empty( $option_name ) ) {
	return '';
}

return 'file:./view.php';
