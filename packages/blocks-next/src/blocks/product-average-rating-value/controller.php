<?php

if ( ! ( $block->context['show_value'] ?? true ) ) {
	return '';
}

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

return 'file:./view.php';
