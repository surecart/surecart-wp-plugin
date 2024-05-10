<?php
$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$class = $styles['classnames'] ?? '';

$product = $block->context['surecart/product'];

// return the view.
return 'file:./view.php';
