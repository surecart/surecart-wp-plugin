<?php
$label       = $attributes['label'] ?? __( 'Review Title', 'surecart' );
$placeholder = $attributes['placeholder'] ?? __( 'Enter a title for your review', 'surecart' );
$required    = $attributes['required'] ?? false;

return 'file:./view.php';
