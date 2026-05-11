<?php
$current_option = $block->context['surecart/bundleItemOption'] ?? null;
if ( empty( $current_option ) ) {
	return '';
}

return 'file:./view.php';
