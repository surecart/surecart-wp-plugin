<?php
$current_option = $block->context['surecart/bundleItemOption'] ?? null;
if ( empty( $current_option ) || empty( $current_option->values ) ) {
	return '';
}

return 'file:./view.php';
