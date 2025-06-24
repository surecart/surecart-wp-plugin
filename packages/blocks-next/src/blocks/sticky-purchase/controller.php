<?php
$product = sc_get_product();

// Set the interactivity state for the sticky purchase block.
wp_interactivity_state( 'surecart/sticky-purchase' );

return 'file:./view.php';
