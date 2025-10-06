<?php
$label       = $attributes['label'] ?? __( 'Review Content', 'surecart' );
$placeholder = $attributes['placeholder'] ?? '';
$required    = $attributes['required'] ?? true;
$rows        = $attributes['rows'] ?? 4;


return 'file:./view.php';
