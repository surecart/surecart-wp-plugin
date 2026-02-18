<?php
if ( empty( $block->context['review']->body ) ) {
	return;
}

return 'file:./view.php';
