<?php

$style = sc_get_cart_block_style( $attributes );

// Alignment style.
$style .= ! empty( $attributes['align'] ) ? 'text-align: ' . $attributes['align'] . ';' : '';

// Return the view.
return 'file:./view.php';
