<?php

$removable = $block->context['removable'] ?? true;

if ( empty( $removable ) ) {
	return null;
}

return 'file:./view.php';
