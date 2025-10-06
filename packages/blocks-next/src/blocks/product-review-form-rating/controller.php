<?php
$size       = $attributes['size'] ?? 25;
$fill_color = $attributes['fill_color'] ?? 'var(--sc-color-primary-500)';
$label      = $attributes['label'] ?? __( 'How would you rate this product?', 'surecart' );

return 'file:./view.php';
