<?php
// no collection id context.
if ( empty( $block->context['surecart/radio'] ) ) {
	return;
}

$radio = (object) $block->context['surecart/radio'];

// return the view.
return 'file:./view.php';
