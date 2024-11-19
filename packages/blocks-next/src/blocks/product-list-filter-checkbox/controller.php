<?php
// no collection id context.
if ( empty( $block->context['surecart/checkbox'] ) ) {
	return;
}

$checkbox = (object) $block->context['surecart/checkbox'];

// return the view.
return 'file:./view.php';
