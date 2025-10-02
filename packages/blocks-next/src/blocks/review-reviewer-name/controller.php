<?php
if ( empty( $block->context['review'] ) ) {
	return;
}

$customer = $block->context['review']->customer ?? null;

return 'file:./view.php';
