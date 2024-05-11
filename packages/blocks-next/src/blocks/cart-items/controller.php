<?php
$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$class = $styles['classnames'] ?? '';

// Handle cart view and states.

// return the view.
return 'file:./view.php';
