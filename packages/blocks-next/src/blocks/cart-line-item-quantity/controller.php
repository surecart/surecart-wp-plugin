<?php

$editable = $context['editable'] ?? true;

if ( empty( $editable ) ) {
	return 'file:./static.php';
}

return 'file:./view.php';
